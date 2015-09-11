class CallbacksController < Devise::OmniauthCallbacksController
  def twitter
    @user = User.from_omniauth(request.env["omniauth.auth"])
    sign_in_and_redirect @user
  end

  def github
    @user = User.from_omniauth(request.env["omniauth.auth"])
    logger.info  request.env["omniauth.auth"]

    sign_in_and_redirect @user
  end

end
