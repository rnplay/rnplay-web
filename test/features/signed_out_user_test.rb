require "test_helper"

class SignedOutUserTest < Capybara::Rails::TestCase
  test "visitor can access home page" do
    visit root_path
    assert_content page, "React Native Appground"
  end

  test "visitor can access app page" do
    visit app_path(App.first)
  end

  test "visitor can access sign in page" do
    visit '/users/sign_in'
  end

end
