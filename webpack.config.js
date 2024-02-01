const path = require('path');
const fs = require("fs");

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/js/app.js',
  output: {
    filename: 'app.dist.js',
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    }
  },
  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      }
    ]
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '.'),
    },
    setupMiddlewares: function (middlewares, devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }
      const api = require("./mock/api");
      api(devServer);
      return middlewares;
    },
    compress: true,
    port: 8081,
  }
};