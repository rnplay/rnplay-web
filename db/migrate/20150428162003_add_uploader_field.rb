class AddUploaderField < ActiveRecord::Migration
  def change
    add_column :rn_apps, :app_bundle, :string
  end
end
