class FilesController < ApplicationController
  respond_to :json

  before_action :authenticate_user!

  # TODO: use the CSRF token since we want high security for uploading files

  protect_from_forgery except: [:update]

  def update
    @app = current_user.apps.find(params[:app_id])

    respond_to do |format|
      format.json do
        if @app
          @app.update_file(params[:id], file_params[:body])
          render nothing: true, status: :ok
        else
          render json: {error: 'Unauthorized!'}
        end
      end
    end
  end

  private

  def file_params
    params.permit(:body, :app_id, :id)
  end

end
