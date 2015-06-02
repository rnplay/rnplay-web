class RnApp < ActiveRecord::Base
  mount_uploader :app_bundle, AppBundleUploader
end
