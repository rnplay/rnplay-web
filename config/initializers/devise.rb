Devise.setup do |config|
  config.secret_key = '85b283d455017df7c9a8087cba73f8ee2248cdcc101fe520848311dcaefcbc558e8b34004e2422774df47a95110a5ed5d0683a39bc2538aaf233f0108e789dfb'

  config.mailer_sender = 'info@rnplay.org'
  require 'devise/orm/active_record'

  config.case_insensitive_keys = [ :email ]
  config.strip_whitespace_keys = [ :email ]
  config.skip_session_storage = [:http_auth]
  config.stretches = Rails.env.test? ? 1 : 10
  config.expire_all_remember_me_on_sign_out = true
  config.password_length = 8..128

  config.reset_password_within = 6.hours
  config.sign_out_via = :delete

  config.omniauth :twitter, ENV['TWITTER_KEY'], ENV['TWITTER_SECRET']
  config.omniauth :github, ENV['GITHUB_KEY'], ENV['GITHUB_SECRET']

end
