const path = require('path')
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = {
  entry: {
    coding: './coding/src/index.js',
  },
  output: {
    path: path.resolve('./coding/static/coding/'),
    filename: '[name]-[fullhash].js',
    publicPath: 'static/coding/',
  },
  plugins: [
    new CleanWebpackPlugin(),
    new BundleTracker({
      path: __dirname,
      filename: './webpack-stats.json',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 8192,
                    name: '[name].[hash:7].[ext]'
                },
             },
         ],
    }
    ],
  }
}