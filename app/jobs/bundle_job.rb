class BundleJob

  include Sidekiq::Worker

  def perform(id)
    app = App.find(id)
    app.bundle_js
  end

end
