require 'capistrano-deploy'
use_recipes :git, :bundle, :rails, :passenger

server 'hetzner.rnplay.org', :web, :app, :db, :primary => true
set :app_name, 'rnplay'
set :user, 'app'
set :deploy_to, "/home/app/rails/#{app_name}"
set :repository, 'git@github.com:jsierles/rnplay.git'
set :container_name, 'rnplay_rnplay_1'

default_run_options[:pty] = true

after "deploy:update", "docker:bundle", "docker:precompile_assets", "docker:fix_file_ownership"

task :staging do
  set :container_name, 'rnplay_rnplaystaging_1'
  set :deploy_to, "/home/app/rails/#{app_name}_staging"
end

task :worker do
  set :container_name, 'rnplay_worker_1'
  set :deploy_to, "/home/app/rails/#{app_name}"
end

task :restart do
  run "touch #{deploy_to}/tmp/restart.txt"
end

task :tail do
  sudo "docker logs -f #{container_name}" do |channel, stream, data|
    puts data
    break if stream == :err
  end
end

namespace :docker do

  task :bundle do
    docker_exec('bundle --deployment --without development test')
  end

  task :precompile_assets do
    docker_exec('source .powenv && RAILS_ENV=production bundle exec rake assets:precompile')
  end

  task :fix_file_ownership do
    docker_exec("chown -R app:app /app/tmp")
  end

  task :migrate do
    docker_exec("rake db:migrate")
  end

  # desc "Build app docker container"
  # task :build do
  #   run "cp ~/.ssh/authorized_keys #{deploy_to} && cd #{deploy_to} && #{sudo} docker build -t #{app_name} ."
  # end


  #
  # task :relaunch do
  #   build
  #   run "#{sudo} docker stop rnplay && #{sudo} docker rm rnplay"
  #   launch
  # end
end

def docker_exec(cmd)
  sudo "docker exec -t -i #{container_name} bash -l -c '#{cmd}'"
end
