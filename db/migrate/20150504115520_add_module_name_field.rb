class AddModuleNameField < ActiveRecord::Migration
  def change
    add_column :rnfiddles, :module_name, :string
  end
end
