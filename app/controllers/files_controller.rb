class FilesController < ApplicationController
  respond_to :json

  before_action :authenticate_user!

  # TODO: use the CSRF token since we want high security for uploading files

  protect_from_forgery except: [:update]

  def update
    @app = current_user.apps.find(params[:app_id])
    if @app
      @app.target_git_repo.update_file(params[:id], file_params[:body])
      @app.set_module_name
      @app.target_git_repo.commit_all_changes("Updated from rnplay.org")
      render json: {message: "File updated."}, status: :ok
    else
      render json: {error: 'Unauthorized!'}
    end
  end

  private

  def file_params
    params.permit!
  end

end
