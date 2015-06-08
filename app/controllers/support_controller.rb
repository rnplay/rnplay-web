class SupportController < ApplicationController

  def new

  end

  def create
    SupportMailer.contact(params[:email], params[:message]).deliver
    render json: {success: true}
  end

end
