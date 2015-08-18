require 'sidekiq/api'

if !Rails.env.development?

  redis_config = { url: 'redis://redis:6379', namespace: 'sidekiq' }

  Sidekiq.configure_server do |config|
    config.redis = redis_config
  end

  Sidekiq.configure_client do |config|
    config.redis = redis_config
  end

end
