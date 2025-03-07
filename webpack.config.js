const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: './app.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
    publicPath: './'
  },
  experiments: {
    topLevelAwait: true
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.FIREBASE_API_KEY': JSON.stringify(process.env.FIREBASE_API_KEY),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      'process.env.DATABASE_URL': JSON.stringify(process.env.DATABASE_URL),
      'process.env.SENDER_ID': JSON.stringify(process.env.SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(process.env.FIREBASE_APP_ID),
      'process.env.MEASUREMENT_ID': JSON.stringify(process.env.MEASUREMENT_ID),
      'process.env.AUTH_DOMAIN': JSON.stringify(process.env.AUTH_DOMAIN),
      'process.env.STORAGE_BUCKET': JSON.stringify(process.env.STORAGE_BUCKET),
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'index.html', to: 'index.html' },
        { from: 'styles.css', to: 'styles.css' }
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-syntax-top-level-await']
          }
        }
      }
    ]
  }
};
