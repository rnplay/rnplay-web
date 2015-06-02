class AddViewCountToPlays < ActiveRecord::Migration
  def change
    add_column :plays, :view_count, :integer, default: 0, null: false
  end
end
