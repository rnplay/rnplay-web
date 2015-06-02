class RenameOldAvatarField < ActiveRecord::Migration
  def change
    rename_column :users, :avatar_url, :old_avatar_url
  end
end
