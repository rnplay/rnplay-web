class AddForkedPlayId < ActiveRecord::Migration
  def change
    add_column :plays, :forked_play_id, :integer
  end
end
