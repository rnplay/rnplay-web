module ApplicationHelper

  def fixed_webpack_include_tag(entry)
    if WebpackRails.config.use_dev_server
      javascript_include_tag("/webpack/dev-server/#{entry}")
    else
      javascript_include_tag("/webpack/#{WebpackRails::Precompiled[entry]['js']}")
    end
  end

end
