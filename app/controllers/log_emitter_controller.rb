class LogEmitterController < ApplicationController

  include ActionController::Live

  def connect
    response.headers['Content-Type'] = 'text/event-stream'
    @redis ||= Redis.connect
    puts params.inspect
    @redis.subscribe(params[:id]) do |on|
      on.subscribe do |channel, subscriptions|
        puts "Subscribed to ##{channel} (#{subscriptions} subscriptions)"
      end

      on.message do |channel, message|
        puts channel
        puts message.inspect
        sse ||= SSE.new(response.stream, retry: 300, event: "log")
        sse.write(message)
      end
    end
  end

end
