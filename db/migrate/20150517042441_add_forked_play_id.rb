class AddForkedAppId < ActiveRecord::Migration
  def change
    add_column :apps, :forked_app_id, :integer
  end
end
