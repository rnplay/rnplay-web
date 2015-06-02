class AddViewCountToApps < ActiveRecord::Migration
  def change
    add_column :apps, :view_count, :integer, default: 0, null: false
  end
end
