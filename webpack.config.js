let path = require('path')
let UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'lib'),
    filename: 'GlpiRestClient.js',
    library: 'GlpiRestClient',
    libraryTarget: 'umd',
  },
  externals: [
    'url',
    'https',
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'stage-0'],
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
