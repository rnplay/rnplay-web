class AddBuildIdToApp < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.string :name
      t.string :appetize_id
      t.timestamps
    end

    BuildVersionUpdater.execute
    add_column :apps, :build_id, :integer

    App.find_each do |app|
      app.update_attributes(build_id: Build.first.id)
    end
  end

  def self.down
    drop_table :builds
    remove_column :apps, :build_id, :integer
  end
end
