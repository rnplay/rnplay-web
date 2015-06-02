class AddPicks < ActiveRecord::Migration
  def change
    add_column :plays, :pick, :boolean
  end
end
