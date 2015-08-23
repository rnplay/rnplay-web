web: bundle exec rails server -p 34560
webpack: node_modules/.bin/webpack-dev-server --port 34570
packager: node node_modules/react-native/packager/packager.js --root ./app_js --port 34580
ngrok_packager: ngrok http -subdomain=$NGROK_PACKAGER_SUBDOMAIN 34580
worker: bundle exec sidekiq
