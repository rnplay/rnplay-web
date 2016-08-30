class PushTokensController < ApplicationController
  skip_before_filter :verify_authenticity_token,
    if: Proc.new { |c| c.request.format == 'application/json' }

  acts_as_token_authentication_handler_for User,
    fallback: :devise,
    only: [:index, :create, :destroy]

  respond_to :json

  def index
    @push_tokens = current_user.push_tokens.all
    render json: @push_tokens.to_json
  end

  def create
    if !user_signed_in?
      render json: {error: 'User not signed in'}
      return
    end

    @push_tokens = current_user.push_tokens.all
    if @push_tokens.map(&:value).include?(push_token_params[:value])
      render json: {success: 'exists'}
    else
      current_user.push_tokens.create(value: push_token_params[:value])
      render json: {success: 'created'}
    end
  end

  def destroy
    @push_tokens = current_user.push_tokens.where(value: params[:id]).all

    if @push_tokens.count > 0
      @push_tokens.destroy_all
      render json: {success: 'deleted'}
    else
      render json: {success: 'noop'}
    end
  end

  private

  def push_token_params
    params.require(:push_token).permit(:value)
  end
end
