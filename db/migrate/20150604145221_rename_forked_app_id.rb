class RenameForkedAppId < ActiveRecord::Migration
  def change
    rename_column :apps, :forked_play_id, :forked_app_id
  end
end
