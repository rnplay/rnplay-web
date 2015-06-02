class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception,
    unless: Proc.new { |c| c.request.format == 'application/json' }

  protect_from_forgery with: :null_session,
    if: Proc.new { |c| c.request.format == 'application/json' }

  force_ssl if: :ssl_configured?
  rescue_from ActiveRecord::RecordNotFound, with: :not_found

  protected

  def ssl_configured?
   !Rails.env.development?
  end

  def not_found
    redirect_to root_url
  end
end
