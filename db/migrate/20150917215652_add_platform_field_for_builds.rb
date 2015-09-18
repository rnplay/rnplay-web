class AddPlatformFieldForBuilds < ActiveRecord::Migration
  def change
    add_column :builds, :platform, :string
  end
end
