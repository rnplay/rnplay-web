json.array!(@apps) do |app|
  json.extract! app, :id, :name, :updated_at, :url_token, :module_name, :view_count, :bundle_url
  json.creator do
    json.build_name play.try(:build).try(:name)
    json.avatar_url app.try(:creator).try(:avatar).try(:url)
    json.username app.try(:creator).try(:username)
  end
end
