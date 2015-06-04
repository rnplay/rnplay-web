json.array!(@plays) do |play|
  json.extract! play, :id, :name, :updated_at, :url_token, :module_name,
                      :view_count, :bundle_url, :pick, :build_id,
                      :creator_id

  json.build_name play.try(:build).try(:name)

  json.creator do
    json.avatar_url play.try(:creator).try(:avatar).try(:url)
    json.username play.try(:creator).try(:username)
  end
end
