class RenamePlaysTable < ActiveRecord::Migration
  def change
    rename_table :plays, :apps
  end
end
