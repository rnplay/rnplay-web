SimpleTokenAuthentication.configure do |config|
  config.sign_in_token = false
  config.skip_devise_trackable = true
end
