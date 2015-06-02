class AddUseVimKeybindingsToUsers < ActiveRecord::Migration
  def change
    add_column :users, :use_vim_keybindings, :boolean
  end
end
