class Build < ActiveRecord::Base
  has_many :apps

  def short_name
    name.gsub(".", "").gsub("-", "")
  end

end
