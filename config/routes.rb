Rails.application.routes.draw do

  root 'welcome#index'

  devise_for :users, :controllers => {
    :omniauth_callbacks => "callbacks",
    :sessions => "users/sessions",
    :registrations => "users/registrations"
  }

  get '/profile' => 'devise/registrations#edit', as: :profile

  get '/plays/:id' => 'apps#show'
  get '/plays/:id/edit' => 'apps#show'

  resources :apps do
    member do
      post :fork
      get :raw_simulator
      get :qr
      post :log
      post :view
    end

    collection do
      get :search
      post :search
      get :public
      get :recent
      get :picks
      get :popular
    end
  end

  post '/log' => 'logs#log'
  get '/log/:id' => 'log_emitter#connect'

  get '/builds/:version/apps/public' => 'apps#public',
    constraints: {version: /.*/ }

  require 'sidekiq/web'

  authenticate :user, lambda { |u| u.admin? } do
    mount Sidekiq::Web => '/sidekiq'
  end


  get '/privacy', to: "pages#privacy"
  get '/:username/:id', to: "apps#show", as: :user_app
  get '/:username', to: "apps#public_index", as: :user_apps

end
