class AddPicks < ActiveRecord::Migration
  def change
    add_column :apps, :pick, :boolean
  end
end
