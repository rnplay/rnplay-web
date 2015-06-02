class AddModuleName < ActiveRecord::Migration
  def change
    add_column :rn_apps, :module_name, :string
  end
end
