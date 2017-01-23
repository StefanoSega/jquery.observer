var webpack = require('webpack');

module.exports = {
  entry: "./src/jquery.observer.js",
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