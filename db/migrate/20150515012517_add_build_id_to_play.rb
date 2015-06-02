class AddBuildIdToPlay < ActiveRecord::Migration
  def self.up
    create_table :builds do |t|
      t.string :name
      t.string :appetize_id
      t.timestamps
    end

    BuildVersionUpdater.execute
    add_column :plays, :build_id, :integer

    Play.find_each do |play|
      play.update_attributes(build_id: Build.first.id)
    end
  end

  def self.down
    drop_table :builds
    remove_column :plays, :build_id, :integer
  end
end
