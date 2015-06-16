class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception,
    unless: Proc.new { |c| c.request.format == 'application/json' }

  protect_from_forgery with: :null_session,
    if: Proc.new { |c| c.request.format == 'application/json' }

  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  acts_as_token_authentication_handler_for User

  protected

  def not_found
    redirect_to root_url
  end
end
