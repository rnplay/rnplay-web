class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception,
    unless: Proc.new { |c| c.request.format == 'application/json' }

  protect_from_forgery with: :null_session,
    if: Proc.new { |c| c.request.format == 'application/json' }

  def is_exponent_client?
    request.headers['Exponent-SDK-Version'].present?
  end

  def after_sign_in_path_for(resource)
    sign_in_url = new_user_session_url
    if request.referer == sign_in_url
      super
    else
      stored_location_for(resource) || request.referer || root_path
    end
  end
end
