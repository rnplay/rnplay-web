class ScreenshotJob < ActiveJob::Base
  queue_as :default

  def perform(app_id)
    App.find(app_id).take_simulator_screenshot
  end
end
