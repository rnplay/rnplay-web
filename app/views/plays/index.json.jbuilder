json.array!(@plays) do |play|
  json.extract! play, :id, :name, :body, :author
  json.url play_url(play, format: :json)
end
