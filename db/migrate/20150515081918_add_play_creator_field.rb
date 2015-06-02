class AddAppCreatorField < ActiveRecord::Migration
  def change
    remove_column :apps, :author, :string
    add_column :apps, :creator_id, :integer
  end
end
