class Build < ActiveRecord::Base
  has_many :apps
  scope :exponent, -> { where('left(builds.name, 4)::float >= ?', 0.31) }

  def short_name
    name.gsub(".", "").gsub("-", "")
  end

  def exponent
    name.to_f > 0.24
  end

  def self.default
    find_by(platform: 'ios', name: "0.31.1")
    #find_by(platform: 'ios', name: "0.24.1")
  end

end
