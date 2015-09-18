class MigrateExistingBuildsAndAppsToIos < ActiveRecord::Migration
  def change
    Build.update_all(platform: 'ios')
    App.update_all(ios: true)
  end
end
