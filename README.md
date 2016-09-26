# Twitch Stream Search

A simple search feature written using [Twitch's Kraken API](https://github.com/justintv/Twitch-API/blob/master/README.md).


View it here: [arnoldsandoval.github.io/twitch-stream-search](http://arnoldsandoval.github.io/twitch-stream-search)

## Getting Started
If you havent already, you will need to install Node, Gulp and Sass.

1. run `npm install` to install dependencies required by project
2. run `gulp` to start browserify and all associated tasks

#### Directory Structure
- `/app`
  - `/components` reusable components that the user interacts with
  - `/utils` contains utilities used throughout the project
- `/dist` contains all compiled assets to be deployed to your server

## Known Issues
- On occasion you'll notice that the application won't display a complete set of results. This is due to the way the `limit` parameter works in the Kraken API. [This appears to be a known issue](https://discuss.dev.twitch.tv/t/is-the-search-streams-part-of-the-api-broken/2385).
