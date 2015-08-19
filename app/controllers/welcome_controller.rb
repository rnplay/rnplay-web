class WelcomeController < ApplicationController

 def index
   @app = Rails.env.development? || Rails.env.staging? ? App.first : App.find(7)
     @app = App.find(7) # Noodle soup app
   else
     @app = App.first
   end
 end
end
