class AddPlatformFieldsToApp < ActiveRecord::Migration
  def change
    add_column :apps, :ios, :boolean
    add_column :apps, :android, :boolean
  end
end
