const path = require('path');

module.exports = {
  mode: 'development',
  devtool : false,
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname , 'static'),
    filename: 'board.dist.js',
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
  }
};