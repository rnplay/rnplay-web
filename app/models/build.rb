require 'fileutils'

class Build < ActiveRecord::Base

  include Commands

  after_save :create_build_directory
  
  has_many :apps

  scope :production, -> { where("name != '0.7.1'") }

  def stripped_name
    name.gsub(".", "").gsub("-", "")
  end

  def npm_install
    run("cd #{Rails.root}/builds/#{name} && npm install")
  end

  def create_build_directory
    FileUtils.mkdir_p "#{Rails.root}/builds/#{name}"
  end

end
