json.array!(@plays) do |play|
  json.extract! play, :id, :name, :updated_at, :url_token, :module_name, :view_count, :bundle_url
  json.creator do
    json.avatar_url play.creator.avatar.try(:url)
    json.username play.creator.username
  end
end
