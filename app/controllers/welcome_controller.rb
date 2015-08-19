class WelcomeController < ApplicationController

 def index
   if Rails.env.development?
     @app = App.create
   elsif Rails.env.staging?
     @app = App.first
   else
     @app = App.find(7) # Noodle soup app
   end
 end

end
