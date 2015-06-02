class AddUrlTokenToFiddles < ActiveRecord::Migration
  def change
    add_column :rnfiddles, :url_token, :string
  end
end
