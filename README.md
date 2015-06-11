## Setup

Create a file named .env, with the following contents. Replace the database placeholder values with your own. The twitter keys are for development and don't require customization.

```
TWITTER_KEY=T34JvmHO6BTLbqfMWo0cDi2F2
TWITTER_SECRET=ObvEyaNo7yV7rgtzs0z8sqjiIfTIsuUlQV33u9sX0aaWaqJ5I7
DATABASE_URL=postgresql://user:pass@localhost/rnplay_development?pool=5
```

Run:

```
bundle install
rake db:setup add_version_data
```

If you get an error installing the pg gem, find pg_config on your filesystem, then:

```
export CONFIGURE_ARGS="with-pg-config=/path/to/bin/pg_config"
```

Then bundle install again.

## Running the app under katon

Katon makes it easy to access the app via a local dev URL, and automatically starts and stops the server. This also makes it easier to manage callbacks and access the site from devices on the network via xip.io, or remotely via ngrok.com.

```
npm install -g katon
katon add 'bin/rails server --port $PORT --binding=0.0.0.0'
```

Then visit http://rnplay.ka. Reload the page if the server takes too long to start on the first load.

## Running the packager locally for the simulator

We can run the packager locally and tunnel traffic to it using [ngrok](http://ngrok.com).

Install ngrok and start a tunnel to port 8081.

```
ngrok http 8081

```

Take note of the randonly assigned subdomain. Add it to your Rails .env file:

```
NGROK_SUBDOMAIN=660ef9ba
```

Restart the Rails app. Visit a play page to generate some javascript.

Clone the packager repo.

```
git clone https://github.com/jsierles/react-native-packager-docker.git
```

Update the React version you want to test in *package.json*, then *npm install*.

Run the packager, adding root path of the Rails app play_js directory.

```
node node_modules/react-native/packager/packager.js --root ../rnplay/play_js
```

Now the simulator should be working!
