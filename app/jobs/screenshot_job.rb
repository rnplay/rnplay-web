class ScreenshotJob < ActiveJob::Base
  queue_as :default

  def perform(play_id)
    Play.find(play_id).take_simulator_screenshot
  end
end
