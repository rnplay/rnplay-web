json.array!(@apps) do |app|
  json.extract! app, :id, :name, :updated_at, :url_token, :module_name, :view_count, :bundle_url, :bundle_path
  json.build_name app.try(:build).try(:name)

  json.creator do
    json.avatar_url app.try(:creator).try(:avatar).try(:url)
    json.username app.try(:creator).try(:username)
  end
end
