class LogsController < ApplicationController

  skip_before_filter :verify_authenticity_token

  def log
    @redis ||= Redis.connect
    @redis.publish params[:play_id], params.to_json
    render nothing: true
  end

end
