class WelcomeController < ApplicationController

 def index
   if Rails.env.production?
     @app = App.find(7) # Noodle soup app
   else
     @app = App.first
   end
 end

end
