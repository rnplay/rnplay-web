class User < ActiveRecord::Base
  acts_as_token_authenticatable

  devise :database_authenticatable,
         :recoverable, :rememberable, :trackable,
         :omniauthable, :omniauth_providers => [:github]

  has_many :apps, foreign_key: :creator_id
  has_many :push_tokens

  mount_uploader :avatar, AvatarUploader

  # attr_accessor :current_password
  # # extracted from Devise
  # validates_presence_of   :email, if: :email_required?
  # validates_uniqueness_of :email, allow_blank: true
  #
  # validates_presence_of     :password, if: :password_required?
  # validates_confirmation_of :password, if: :password_required?

  # def password_required?
  #   !persisted? || !password.blank? || !password_confirmation.blank?
  # end
  #
  # # twitter doesn't provide an email, so let's not require it yet
  # def email_required?
  #   false
  # end
  #
  # def update_without_password(params, *options)
  #   result = update_attributes(params, *options)
  #   clean_up_passwords
  #   result
  # end

  def self.from_omniauth(auth)
    if existing_user = find_by(email: auth.info.email)
      if !existing_user.provider.present? || existing_user.provider == 'twitter'
        existing_user.update_attribute(:provider, "github")
        existing_user.update_attribute(:uid, auth.uid)
      end
    end

    user = where(provider: auth.provider, uid: auth.uid).first_or_create do |user|
      user.provider = auth.provider
      user.uid = auth.uid
      user.name = auth.info.name
      user.email = auth.info.email
      user.username = auth.info.nickname
      user.remote_avatar_url = auth.info.image
      user.password = Devise.friendly_token[0,20]
    end

    user.update_attributes(name: auth.info.name) if !user.name
    user.update_attributes(username: auth.info.nickname) if !user.username
    user.update_attributes(remote_avatar_url: auth.info.image) if !user.avatar.file
    user
  end
end
