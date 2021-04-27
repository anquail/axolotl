const path = require("path");

module.exports = {
  entry: "./client/index.js",
  devServer: {
    publicPath: "/build/",
    historyApiFallback: true,
    contentBase: "./client",
    proxy: {
      "/": "http://localhost:3000",
      "/home": "http://localhost:3000",
      "/api": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/users": "http://localhost:3000",
    },
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js",
  },
  mode: process.env.NODE_ENV,
  module: {
    rules: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
