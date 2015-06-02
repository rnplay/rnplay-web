class CreateRnApps < ActiveRecord::Migration
  def change
    create_table :rn_apps do |t|
      t.string :name
      t.string :s3_url
      t.text :description
      t.string :author
      t.string :github_url

      t.timestamps null: false
    end
  end
end
