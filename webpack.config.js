const path = require("path");
const webpack = require("webpack");

module.exports = {
  // ...
  resolve: {
    fallback: {
      "stream-http": require.resolve("stream-http"),
      net: require.resolve("net-browserify"),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      "stream-http": "stream-http",
      net: "net-browserify",
    }),
  ],
  // ...
};
