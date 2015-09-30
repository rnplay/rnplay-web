require File.expand_path('../boot', __FILE__)

require 'rails/all'

Bundler.require(*Rails.groups)

module Rnplay
  class Application < Rails::Application
    config.active_record.raise_in_transactional_callbacks = true
    config.action_mailer.delivery_method = :postmark
    config.action_mailer.postmark_settings = { :api_token => ENV['POSTMARK_KEY'] || 'POSTMARK_API_TEST' }
    config.action_mailer.default_url_options = { :host => 'rnplay.org' }
    config.active_job.queue_adapter = :sidekiq
    config.react.addons = true
    # If we do not use this then render json: .. will escape & in urls and break
    # the app qr code action
    config.active_support.escape_html_entities_in_json = false

    config.assets.precompile += %w( editor_sprockets.js embedded_app.js embedded_app.css)

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
