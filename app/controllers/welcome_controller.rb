class WelcomeController < ApplicationController

 def index
   @app = Rails.env.development? || Rails.env.staging? ? App.first : App.find(7)
 end
end
