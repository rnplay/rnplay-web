class RemoveRnApps < ActiveRecord::Migration
  def change
    drop_table :rn_apps
  end
end
