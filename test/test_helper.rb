ENV["RAILS_ENV"] = "test"
require File.expand_path("../../config/environment", __FILE__)
require "rails/test_help"

require "minitest/rails/capybara"
require "minitest/pride"

class ActiveSupport::TestCase
  ActiveRecord::Migration.check_pending!
  fixtures :all
end
