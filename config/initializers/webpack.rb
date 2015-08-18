WebpackRails.setup do |config|
  config.use_dev_server = (Rails.env.development? || Rails.env.test?)
  config.dev_server_port = 34570
end
