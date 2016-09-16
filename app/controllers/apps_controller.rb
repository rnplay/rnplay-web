require 'httparty'
require 'json'

class AppsController < ApplicationController
  respond_to :html, :json

  layout :pick_layout
  before_action :set_app, only: [:show, :edit, :destroy, :raw_simulator, :qr, :view, :fork, :exp_manifest, :push]
  before_action :paginate, only: [:popular, :search, :picks, :index]

  acts_as_token_authentication_handler_for User, fallback: :none, only: :create
  acts_as_token_authentication_handler_for User, fallback: :devise, only: [:index]
  before_action :authenticate_user!, only: [:index, :update, :destroy, :new]

  protect_from_forgery except: [:show, :create, :update, :fork]

  def index
    if is_exponent_client?
      @apps = current_user.apps.exponent.order("updated_at desc")
    else
      @apps = current_user.apps.order("updated_at desc")
    end

    respond_to do |format|
      format.html
      format.json do
        @apps = @apps.for_platform(platform).limit(@per_page).offset(@offset)
        render 'apps'
      end
    end
  end

  def push
    if user_signed_in?
      # app = JSON.parse(render_to_string(template: 'app.json.jbuilder', locals: {app: @app}))

      @push_tokens = current_user.push_tokens.all
      @push_tokens.each do |token|
        exponent.publish(
          exponentPushToken: token.value,
          message: "#{@app.name} on Playground",
          data: {url_token: @app.url_token},
        )
      end

      render json: {success: true}
    end
  end

  def exp_manifest
    platform = request.headers['Exponent-Platform']
    bundle_url = "https://packagerexponent.rnplay.org/js/#{@app.url_token}/index.#{platform}.bundle?platform=#{platform}&dev=true&strict=false&minify=false&hot=false&includeAssetFileHashes=true"

    unsigned_manifest = {
      "name": @app.name,
      "version":"1.0.0",
      "description": "An app on Playground",
      "appKey": @app.module_name,
      "orientation":"portrait",
      "primaryColor":"#6631BA",
      "sdkVersion":"10.0.0",
      "publishedTime":"2016-09-14T03:49:32.071Z",
      "debuggerHost": bundle_url,
      "iconUrl":"https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png",
      "packagerOpts": {
        "dev":true,
        "minify":false,
      },
      "loading": {
        "hideExponentText":false,
        "iconUrl":"https://s3.amazonaws.com/exp-brand-assets/ExponentEmptyManifest_192.png"
      },
      "xde":true,
      "developer":{
        "tool":"rnplay"
      },
      "bundleUrl": bundle_url
    }
    signed_manifest = sign_manifest(unsigned_manifest)

    render json: signed_manifest
  end

  def recent
    if is_exponent_client?
      @apps = App.exponent.order("updated_at desc").limit(30)
    else
      @apps = App.order("updated_at desc").limit(30)
    end
  end

  def qr
    if user_signed_in? && current_user.email == 'brentvatne@gmail.com'
      push
    else
      qr_code = GoogleQR.new(data: %({"bundle_path": "#{@app.bundle_path}", "module_name": "#{@app.module_name}"}), size: '250x250')
      render json: {url: qr_code.to_s}
    end
  end

  def search
    if is_exponent_client?
      @apps = App.exponent.enabled.where(["lower(name) LIKE lower(?)", "%#{params[:name]}%"]).for_platform(platform).limit(@per_page).offset(@offset)
    else
      @apps = App.enabled.where(["lower(name) LIKE lower(?)", "%#{params[:name]}%"]).for_platform(platform).limit(@per_page).offset(@offset)
    end

    render 'apps'
  end

  def platform
    params[:platform] == 'undefined' ? "ios" : params[:platform]
  end

  def picks
    if is_exponent_client?
      @apps = App.exponent.where(pick: true).enabled.for_platform(platform).order('updated_at desc').limit(@per_page).offset(@offset)
    else
      @apps = App.where(pick: true).enabled.for_platform(platform).order('updated_at desc').limit(@per_page).offset(@offset)
    end

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def popular
    if is_exponent_client?
      @apps = App.exponent.order('view_count desc').enabled.for_platform(platform).order('updated_at desc').limit(@per_page).offset(@offset)
    else
      @apps = App.order('view_count desc').enabled.for_platform(platform).order('updated_at desc').limit(@per_page).offset(@offset)
    end

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def recent
    if is_exponent_client?
      @apps = App.exponent.enabled.where("name != 'Sample App' AND name != 'Sample App'").order('updated_at desc')
    else
      @apps = App.enabled.where("name != 'Sample App' AND name != 'Sample App'").order('updated_at desc')
    end
  end

  def log
    logger.info params[:log]
  end

  def public
    if params[:version].present?
      @build = Build.where(name: params[:version]).first
      @apps = @build.apps
    else
      @apps = App.enabled.where("name != 'Sample App'")
    end

    if is_exponent_client?
      @apps = @apps.exponent.order("updated_at desc").all
    else
      @apps = @apps.order("updated_at desc").all
    end

    respond_to do |format|
      format.html
      format.json { render json: @apps.to_json(include: {creator: {only: [:username, :avatar_url]}}, except: [:body, :bundle], methods: [:bundle_url])}
    end
  end

  def public_index
    @user = User.find_by(username: params[:username]) || User.find(params[:id])
    raise ActiveRecord::RecordNotFound if !@user
  end

  def raw_simulator
    render layout: nil
  end

  def view
    @app.increment_view_count!
    respond_to do |format|
      format.json do
        render nothing: true
      end
    end
  end

  def show
    @app.migrate_to_git if !@app.migrated_to_git?
    @page_title = @app.name.presence || "Unnamed App"
    @app.increment_view_count!

    creator = User.find(@app.creator_id)
    @creator = creator.name.presence || creator.username.presence || "anonymous"

    respond_to do |format|
      format.html
      format.json { render 'app' }
    end
  end

  def new
    if !user_signed_in?
      redirect_to new_user_session_path,
        notice: 'Please sign in to create a new app'
    elsif current_user.email == 'brentvatne@gmail.com'
      @app = current_user.apps.create({
        enabled: true,
        name: "Sample App",
        module_name: "main",
        build_id: Build.last.id,
        created_from_web: true
      })
    else
      @app = current_user.apps.create({
        enabled: true,
        name: "Sample App",
        module_name: "main",
        build_id: Build.where(name: '0.24.1').first.id,
        created_from_web: true
      })
    end

    redirect_to app_path(@app)
  end

  def fork
    if !user_signed_in?
      render json: {error: 'Please sign in to fork this app'}
    else
      @new_app = current_user.apps.create(name: @app.name, module_name: @app.module_name,
                              build_id: @app.build_id, forked_app: @app, enabled: true)

      render json: {success: true, token: @new_app.url_token}
    end
  end

  def edit
    redirect_to app_path(@app), permanent: true
  end

  def create
    if user_signed_in?
      respond_to do |format|
        if @app = current_user.apps.create(app_params)
          session[:apps] = [] if !session[:apps]
          session[:apps] << @app.id

          format.html { redirect_to app_path(@app), notice: 'App was successfully created.' }
          format.json { render :show, status: :created, location: @app }
        else

          format.html { render :new }
          format.json { render json: @app.errors, status: :unprocessable_entity }
        end
      end
    else
      render json: {error: "You must provide a valid authentication token to create an app"}, status: :unauthorized
    end

  end

  require 'base64'

  def update
    @app = App.find(params[:id])

    if current_user.admin? || (user_signed_in? && @app.created_by?(current_user))
      if app_params[:screenshot]
        image_data = Base64::decode64 app_params[:screenshot].split(",").last
        File.open("#{Rails.root}/public/screenshots/#{@app.url_token}.jpg", "wb") { |f| f.write(image_data) }
      end
      @app.update(app_params.except(:screenshot))
      logger.info @app.errors.inspect
      render json: {success: true}
    else
      render json: {error: 'Access denied'}
    end
  end

  def destroy
    redirect_to root_path unless user_signed_in? && @app.created_by?(current_user)

    @app.destroy
    respond_to do |format|
      format.html { redirect_to apps_url, notice: 'App was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def encode_uri_component(string)
    URI.escape(string, Regexp.new("[^#{URI::PATTERN::UNRESERVED}]"))
  end

  def sign_manifest(unsigned_manifest)
    payload = {
      body: unsigned_manifest
    }

    options = {
      serverSecret: ENV['EXPONENT_SERVER_SECRET'],
      appId: @app.url_token,
    }

    uriEncodedOptions = encode_uri_component(JSON.generate(options))

    result = HTTParty.post(
      "https://exp.host/--/api/signPlaygroundManifest/#{uriEncodedOptions}",
      payload
    )

    signed_manifest = JSON.parse(JSON.parse(result.response.body)['response'])
    signed_manifest
  end

  def paginate
    @per_page = 10
    @page = (params[:page] || 1).to_i
    @offset = (@page - 1) * @per_page
  end

  def set_app
    @app = params[:id] ? App.where(url_token: params[:id]).first : (Rails.env.development? || Rails.env.staging? ? App.first : App.find(7))
    raise ActiveRecord::RecordNotFound if !@app
  end

  def app_params
    params.require(:app).permit(:name, :body, :ios, :android, :module_name, :author, :build_id, :pick, :uses_git, :screenshot)
  end

  def pick_layout
    if (params[:action] == 'edit' || params[:action] == 'show') && @app.enabled
      'editor'
    else
      'application'
    end
  end

  def exponent
    @exponent ||= Exponent::Push::Client.new
  end
end
