var webpack = require('webpack');

module.exports = {
  entry: [
    "./node_modules/jquery-tiny-pubsub/dist/ba-tiny-pubsub.min.js",
    "./src/jquery.observer.js"],
  output: {
    filename: "./dist/bundle.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false }
    })
  ], 
  watch: true
}