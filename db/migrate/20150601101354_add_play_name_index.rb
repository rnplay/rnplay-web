class AddPlayNameIndex < ActiveRecord::Migration
  def change
    add_index :plays, :name
  end
end
