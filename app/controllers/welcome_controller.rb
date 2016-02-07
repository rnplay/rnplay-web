class WelcomeController < ApplicationController

   def index
     @apps = App.where(pick: true).order('updated_at desc').limit(@per_page).offset(@offset)
     respond_to do |format|
       format.html
     end
   end

 def maintenance
   @header_disabled = true
 end
end
