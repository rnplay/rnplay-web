class ChangeRnfiddleToPlay < ActiveRecord::Migration
  def change
    rename_table :rnfiddles, :plays
  end
end
