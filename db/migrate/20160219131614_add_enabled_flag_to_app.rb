class AddEnabledFlagToApp < ActiveRecord::Migration
  def change
    add_column :apps, :enabled, :boolean
    App.update_all enabled: true
  end
end
