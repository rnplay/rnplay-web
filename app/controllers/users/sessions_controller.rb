class Users::SessionsController < Devise::SessionsController
  respond_to :json, :html
  skip_before_filter :verify_authenticity_token, if: Proc.new { |c| c.request.format == 'application/json' }

# before_filter :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

#  def create
#    response.headers['X-CSRF-Token'] = form_authenticity_token
#    super
#  end

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end

  # protected

  # You can put the params you want to permit in the empty array.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.for(:sign_in) << :attribute
  # end
end
