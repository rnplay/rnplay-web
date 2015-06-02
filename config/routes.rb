Rails.application.routes.draw do

  root 'welcome#index'

  devise_for :users, :controllers => {
    :omniauth_callbacks => "callbacks",
    :sessions => "users/sessions",
    :registrations => "users/registrations"
  }

  get '/profile' => 'devise/registrations#edit', as: :profile

  resources :apps do
    member do
      post :fork
      get :raw_simulator
      post :log
    end
    collection do
      get :search
      post :search
      get :public
      get :recent
      get :picks
    end
  end

  post '/log' => 'logs#log'
  get '/log/:id' => 'log_emitter#connect'

  get '/builds/:version/plays/public' => 'plays#public',
    constraints: {version: /.*/ }

  require 'sidekiq/web'

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end


  get '/:username/:id', to: "plays#show", as: :user_play
  get '/:username', to: "plays#public_index", as: :user_plays

end
