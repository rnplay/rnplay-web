class AddUsesGitToApps < ActiveRecord::Migration
  def change
    add_column :apps, :uses_git, :boolean
  end
end
