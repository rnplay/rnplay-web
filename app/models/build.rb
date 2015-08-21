class Build < ActiveRecord::Base
  has_many :apps

  scope :production, -> { where("name != '0.7.1'") }
end
