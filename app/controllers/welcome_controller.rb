class WelcomeController < ApplicationController
  # before_action :under_construction

   def index
     @apps = App.enabled.where(pick: true).order('updated_at desc').limit(@per_page).offset(@offset)
     respond_to do |format|
       format.html
     end
   end

end
