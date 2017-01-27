var webpack = require('webpack');

module.exports = {
  devtool: "source-map",
  entry: [
    "./src/common.js",
    "./src/common.pubsub.js",
    "./src/common.utils.js",
    "./src/jquery.observer.js"],
  output: {
    filename: "./dist/bundle.js"
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      sourceMap: true
    })
  ],
  watch: true
}