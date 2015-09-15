module ApplicationHelper

  def fixed_webpack_include_tag(entry)
    if WebpackRails.config.use_dev_server
      javascript_include_tag("/webpack/dev-server/#{entry}")
    else
      javascript_include_tag("/webpack/#{WebpackRails::Precompiled[entry]['js']}")
    end
  end

  def screenshot_for(app)
    image_tag screenshot_path_for(app), class: 'screenshot', width: 320, height: 568
  end

  def screenshot_path_for(app)
    File.exists?("#{Rails.root}/public/screenshots/#{app.url_token}.jpg") ? "/screenshots/#{app.url_token}.jpg" : asset_path("screenshot-placeholder.svg")
  end

  def app_list_for(user)
    if user
      path = user.username ? user_apps_path(username: user.username) : userid_apps_path(user)
      link_to user.username, path
    else
      "anonymous"
    end
  end

end
