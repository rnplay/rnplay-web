class ValidationsController < ApplicationController
  skip_before_filter :verify_authenticity_token,
    if: Proc.new { |c| c.request.format == 'application/json' }

  respond_to :json, :html

  def email
    render json: {email: params[:email], count: User.where(params[:email]).count}

    # render json: { available: User.where(email: params[:email]).count === 0 }
  end
end
