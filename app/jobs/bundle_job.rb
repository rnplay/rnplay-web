class BundleJob

  include Sidekiq::Worker

  def perform(id)
    ActiveRecord::Base.connection_pool.with_connection do
      app = App.find(id)
      app.bundle_js
    end
  end

end
