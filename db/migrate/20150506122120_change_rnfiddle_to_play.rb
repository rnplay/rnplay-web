class ChangeRnfiddleToApp < ActiveRecord::Migration
  def change
    rename_table :rnfiddles, :apps
  end
end
