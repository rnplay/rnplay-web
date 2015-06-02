class BundleJob
  include SuckerPunch::Job

  def perform(id)
    ActiveRecord::Base.connection_pool.with_connection do
      play = Play.find(id)
      play.bundle_js
    end
  end
end