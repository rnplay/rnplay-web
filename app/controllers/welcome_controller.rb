class WelcomeController < ApplicationController

 def index
   @app = Rails.env.development? ? App.first : App.find(7)
 end
end
