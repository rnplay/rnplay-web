class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception,
    unless: Proc.new { |c| c.request.format == 'application/json' }

  protect_from_forgery with: :null_session,
    if: Proc.new { |c| c.request.format == 'application/json' }

  def is_exponent_client?
    request.headers['Exponent-SDK-Version'].present?
  end

  def is_special_person?
     current_user && (
       current_user.email == 'brentvatne@gmail.com' ||
       current_user.email == 'joshua@diluvia.net'
     )
  end

  def under_construction
    if is_exponent_client?  ||
       request.format == 'application/json' ||
       is_special_person?
      return true
    end

    render text: 'Sorry for the inconvenience, React Native Playground is currently unavailable! We should be back within the next week (date of posting: Saturday, September 17).'
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
