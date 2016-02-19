class AddEnabledFlagToApp < ActiveRecord::Migration
  def change
    add_column :apps, :enabled, :boolean
  end
end
