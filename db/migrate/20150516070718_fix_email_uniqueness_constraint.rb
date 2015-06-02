class FixEmailUniquenessConstraint < ActiveRecord::Migration
  def change
    remove_index :users, :email
    add_index "users", ["email"], name: "index_users_on_email", using: :btree
  end
end
