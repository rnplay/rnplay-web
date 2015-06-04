class AppsController < ApplicationController
  layout :pick_layout
  before_action :set_app, only: [:show, :edit, :destroy, :raw_simulator]
  before_action :authenticate_user!, only: [:index]
  before_action :paginate, only: [:popular, :search, :picks]

  protect_from_forgery except: :show

  def index
    @apps = current_user.apps.all

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def search
    @apps = App.where(["lower(name) LIKE lower(?)", "%#{params[:name]}%"]).limit(@per_page).offset(@offset)
    render 'apps'
  end

  def picks
    @apps = App.where(pick: true).order('updated_at desc').limit(@per_page).offset(@offset)
    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def popular
    @plays = App.order('view_count desc').
      order('updated_at desc').limit(@per_page).offset(@offset)

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def recent
    @apps = App.where("name != 'Sample App' AND name != 'Sample App'").order('updated_at desc')
  end

  def log
    logger.info params[:log]
  end

  def public
    if params[:version].present?
      @build = Build.where(name: params[:version]).first
      @apps = @build.apps
    else
      @apps = App.where("name != 'Sample App'")
    end

    @apps = @apps.order("updated_at desc").all

    respond_to do |format|
      format.html
      format.json { render json: @apps.to_json(include: {creator: {only: [:username, :avatar_url]}}, except: [:body, :bundle], methods: [:bundle_url])}
    end
  end

  def public_index
    @user = User.find_by(username: params[:username])
    raise ActiveRecord::RecordNotFound if !@user
  end

  def raw_simulator
    render layout: nil
  end

  def show
    @page_title = @app.name
    @app.increment_view_count!

    respond_to do |format|
      format.html { render action: :edit }
    end
  end

  def new
    if !user_signed_in?
      redirect_to new_user_session_path,
        notice: 'Please sign in to create a new app'
    else
      @app = current_user.apps.create({
        body: File.read('apps/sample_app.js'),
        name: "Sample App",
        build_id: Build.last.id
      })

      redirect_to edit_app_path(@app)
    end
  end

  def fork
    @app = App.find(params[:id])

    if !user_signed_in?
      render json: {error: 'Please sign in to fork this app'}
    else
      @new_app = current_user.apps.build(app_params)
      @new_app.forked_app_id = params[:id]
      @new_app.save

      render json: {success: true, token: @new_app.url_token}
    end
  end

  def edit
    @page_title = @app.name
    @app.increment_view_count!
  end

  def create
    @app = (user_signed_in? ? current_user.apps : App).new(app_params)

    respond_to do |format|
      if @app.save
        session[:apps] = [] if !session[:apps]
        session[:apps] << @app.id

        format.html { redirect_to app_path(@app), notice: 'App was successfully created.' }
        format.json { render :show, status: :created, location: @app }
      else

        format.html { render :new }
        format.json { render json: @app.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @app = App.find(params[:id])

    if (app_params[:pick] && current_user.admin?) || (user_signed_in? && @app.created_by?(current_user))
      @app.update(app_params)
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

  def paginate
    @per_page = 10
    @page = (params[:page] || 1).to_i
    @offset = (@page - 1) * @per_page
  end

  def set_app
    @app = App.where(url_token: params[:id]).first
    raise ActiveRecord::RecordNotFound if !@app
  end

  def app_params
    params.require(:app).permit(:name, :body, :module_name, :author, :build_id, :pick)
  end

  def pick_layout
    if params[:action] == 'edit' || params[:action] == 'show'
      'editor'
    else
      'application'
    end
  end
end
