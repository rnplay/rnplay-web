class AddBundleField < ActiveRecord::Migration
  def change
    add_column :rnfiddles, :bundle, :text
  end
end
