class PlaysController < ApplicationController
  layout :pick_layout
  before_action :set_play, only: [:show, :edit, :destroy, :raw_simulator]
  before_action :authenticate_user!, only: [:index]

  protect_from_forgery except: :show

  def index
    @plays = current_user.plays.all

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def search
    @plays = Play.where(["lower(name) LIKE lower(?)", "%#{params[:name]}%"])
    render 'apps'
  end

  def picks
    @plays = Play.where(pick: true).order('updated_at desc')
    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def popular
    per_page = 10
    page = (params[:page] || 1).to_i
    offset = (page - 1) * per_page

    @plays = Play.order('view_count desc').
      order('updated_at desc').limit(per_page).offset(page)

    respond_to do |format|
      format.html
      format.json { render 'apps' }
    end
  end

  def recent
    @plays = Play.where("name != 'Sample App' AND name != 'Sample Play'").order('updated_at desc')
  end

  def log
    logger.info params[:log]
  end

  def public
    if params[:version].present?
      @build = Build.where(name: params[:version]).first
      @plays = @build.plays
    else
      @plays = Play.where("name != 'Sample App'")
    end

    @plays = @plays.order("updated_at desc").all

    respond_to do |format|
      format.html
      format.json { render json: @plays.to_json(include: {creator: {only: [:username, :avatar_url]}}, except: [:body, :bundle], methods: [:bundle_url])}
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
    @page_title = @play.name
    @play.increment_view_count!

    respond_to do |format|
      format.html { render action: :edit }
    end
  end

  def new
    if !user_signed_in?
      redirect_to new_user_session_path,
        notice: 'Please sign in to create a new play'
    else
      @play = current_user.plays.create({
        body: File.read('plays/sample_app.js'),
        name: "Sample Play",
        build_id: Build.last.id
      })

      redirect_to edit_play_path(@play)
    end
  end

  def fork
    @play = Play.find(params[:id])

    if !user_signed_in?
      render json: {error: 'Please sign in to fork this play'}
    else
      @new_play = current_user.plays.build(play_params)
      @new_play.forked_play_id = params[:id]
      @new_play.save

      render json: {success: true, token: @new_play.url_token}
    end
  end

  def edit
    @page_title = @play.name
    @play.increment_view_count!
  end

  def create
    @play = (user_signed_in? ? current_user.plays : Play).new(play_params)

    respond_to do |format|
      if @play.save
        session[:plays] = [] if !session[:plays]
        session[:plays] << @play.id

        format.html { redirect_to play_path(@play), notice: 'Play was successfully created.' }
        format.json { render :show, status: :created, location: @play }
      else

        format.html { render :new }
        format.json { render json: @play.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @play = Play.find(params[:id])

    if (play_params[:pick] && current_user.admin?) || (user_signed_in? && @play.created_by?(current_user))
      @play.update(play_params)
      logger.info @play.errors.inspect
      render json: {success: true}
    else
      render json: {error: 'Access denied'}
    end
  end

  def destroy
    redirect_to root_path unless user_signed_in? && @play.created_by?(current_user)

    @play.destroy
    respond_to do |format|
      format.html { redirect_to plays_url, notice: 'Play was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  #
  def set_play
    @play = Play.where(url_token: params[:id]).first
    raise ActiveRecord::RecordNotFound if !@play
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  #
  def play_params
    params.require(:play).permit(:name, :body, :module_name, :author, :build_id, :pick)
  end

  def pick_layout
    if params[:action] == 'edit' || params[:action] == 'show'
      'editor'
    else
      'application'
    end
  end
end
