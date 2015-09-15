desc "Setup development environment"
task :setup do
  %w(db:create db:schema:load add_version_data db:seed).each do |task|
    Rake::Task[task].invoke
  end
end
