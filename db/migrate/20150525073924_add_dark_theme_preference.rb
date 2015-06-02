class AddDarkThemePreference < ActiveRecord::Migration
  def change
    add_column :users, :use_dark_theme, :boolean
  end
end
