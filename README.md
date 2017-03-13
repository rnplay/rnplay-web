## DEPRECATION NOTICE

rnplay.org is shutting down on April 1st, 2017. It's been replaced by https://sketch.expo.io. This repo will remain here for reference, but no longer accepts issues or pull requests. Thanks to everyone who contributed to and supported this project!

## Setup

You should have Ruby 2.2 installed. Preferred way is using [rbenv](https://github.com/sstephenson/rbenv). Once you have that installed, run ```rbenv install 2.2.2```.

You'll also need Postgresql and Redis running locally.

Install a few git-related dependencies via Homebrew:

```
brew install libgit2 cmake
```

Install *foreman* for running the app's different services via the Procfile:

```
gem install foreman
```

Create a file named .env, with the following contents. Replace the database and ngrok placeholder values with your own. The twitter keys are for development and don't require customization.

```
TWITTER_KEY=T34JvmHO6BTLbqfMWo0cDi2F2
TWITTER_SECRET=ObvEyaNo7yV7rgtzs0z8sqjiIfTIsuUlQV33u9sX0aaWaqJ5I7
DATABASE_URL=postgresql://user:pass@localhost/rnplay_development?pool=5
```

Run:

```
bundle install
rake setup
```

If you get an error installing the pg gem, find pg_config on your filesystem, then:

```
export CONFIGURE_ARGS="with-pg-config=/path/to/bin/pg_config"
```

Then *bundle install* again.

## Setup for the packager and local simulator

The packager currently requires the supported node_modules to be in the /app_js directory. More docs on this soon.

Finally, to tunnel traffic from the simulators to our machine, install [ngrok](http://ngrok.com).

Run ngrok like:

```
ngrok http 34580
```

Then, add this line to .env:

```
NGROK_SUBDOMAIN=your-random-subdomain
```

Then restart foreman. Your simulator should have access to your local apps.

## Running the app

To run the Rails app, webpack server and the ngrok tunnel together:

```
foreman start
```

Leave this terminal window open, as logs will show up here.

Visit http://localhost:34560 to see the app main page.

## Development

Work on a branch when making changes. Master should always be deployable to production.

The React app entry point is in *app/assets/javascripts/editor.js*. Its props are passed in from the server template *app/views/apps/edit.html.erb*.

All css files are located in *app/assets/stylesheets*.
