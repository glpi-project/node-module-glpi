const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'GlpiRestClient.js',
    library: 'GlpiRestClient',
    libraryTarget: 'umd',
  },
  mode: 'development',
  externals: [
    'url',
    'https',
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['@babel/preset-env'],
        },
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin(),
  ],
  stats: {
    colors: true,
  },
  devtool: 'source-map',
}
