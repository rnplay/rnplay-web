require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(*Rails.groups)

module Rnplay
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
    config.action_mailer.delivery_method = :postmark
    config.action_mailer.postmark_settings = { :api_token => "3997a4ee-7134-4bb8-b148-a5c1c74c7859" }
    config.active_job.queue_adapter = :sidekiq
    config.middleware.insert_before 0, "Rack::Cors", :debug => true, :logger => (-> { Rails.logger }) do
      allow do
        origins '*'

        resource '/cors',
          :headers => :any,
          :methods => [:post],
          :credentials => true,
          :max_age => 0

        resource '*',
          :headers => :any,
          :methods => [:get, :post, :delete, :put, :options, :head],
          :max_age => 0
      end
    end
  end
end
