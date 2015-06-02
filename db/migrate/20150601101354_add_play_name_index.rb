class AddAppNameIndex < ActiveRecord::Migration
  def change
    add_index :apps, :name
  end
end
