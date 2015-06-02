class AddPlayCreatorField < ActiveRecord::Migration
  def change
    remove_column :plays, :author, :string
    add_column :plays, :creator_id, :integer
  end
end
