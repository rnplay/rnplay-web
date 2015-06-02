require "test_helper"

class SignedOutUserTest < Capybara::Rails::TestCase
  test "visitor can access home page" do
    visit root_path
    assert_content page, "React Native Playground"
  end

  test "visitor can access play page" do
    visit play_path(Play.first)
  end

  test "visitor can access sign in page" do
    visit '/users/sign_in'
  end

end
