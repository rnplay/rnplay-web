class RnAppsController < ApplicationController
  def index
    @apps = RnApp.all

    respond_to do |format|
      format.html
      format.json { render json: @apps }
    end
  end

  def edit
    @app = RnApp.find(params[:id])
  end

  def create
    @app = RnApp.create(app_params)
    redirect_to rn_apps_path
  end

  def update
    @app = RnApp.find(params[:id])
    @app.update_attributes(app_params)
    redirect_to rn_apps_path
  end

  def destroy
    @app = RnApp.find(params[:id])
    @app.destroy
    redirect_to rn_apps_path
  end

  private

  def app_params
    params.require(:rn_app).permit(:name, :app_bundle, :module_name, :description)
  end

end
