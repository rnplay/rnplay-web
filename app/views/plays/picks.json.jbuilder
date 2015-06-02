json.array!(@apps) do |app|
  json.extract! app, :id, :name, :updated_at, :url_token, :module_name, :view_count, :bundle_url
  json.creator do
    json.avatar_url app.creator.avatar.try(:url)
    json.username app.creator.username
  end
end
