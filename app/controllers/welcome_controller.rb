class WelcomeController < ApplicationController

 def index
   @play = Rails.env.development? ? Play.first : Play.find(7)
 end
end
