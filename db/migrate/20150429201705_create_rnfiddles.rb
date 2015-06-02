class CreateRnfiddles < ActiveRecord::Migration
  def change
    create_table :rnfiddles do |t|
      t.string :name
      t.text :body
      t.string :author

      t.timestamps null: false
    end
  end
end
