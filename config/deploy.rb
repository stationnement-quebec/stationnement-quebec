set :application, "stationnement-quebec"

server "192.241.251.196", :app
set :deploy_to, "/var/stationnement-quebec"
set :branch, "master"

set :scm, "git"
set :repository,  "https://github.com/stationnement-quebec/stationnement-quebec.git"

set :user, "root"
set :use_sudo, false

set :deploy_via, :remote_cache
set :keep_releases, 5

namespace :deploy do
  desc "Install and build"
  task :build, :roles => :app do
    run "cd #{current_path} && npm install"
  end

  desc "Restart node deamon"
  task :restart_daemons, :roles => :app do
    run "cd #{current_path} && ./node_modules/forever/bin/forever stop server_production.js; true"
    run "cd #{current_path} && NODE_ENV=production ./node_modules/forever/bin/forever start server_production.js"
  end

  desc "Install log rotate script"
  task :rotate_logs, :roles => :app do
    default_run_options[:pty] = true
    rotate_script = %Q{#{shared_path}/log/*.log {
        compress
        copytruncate
        daily
        dateext
        delaycompress
        missingok
        rotate 30
    }}
    put rotate_script, "#{shared_path}/logrotate_script"

    run "cp #{shared_path}/logrotate_script /etc/logrotate.d/#{application}"
    run "rm #{shared_path}/logrotate_script"
  end
end

after "deploy", "deploy:build"
after "deploy", "deploy:restart_daemons"
after "deploy:restart_daemons", "deploy:rotate_logs"
after "deploy:update", "deploy:cleanup"
