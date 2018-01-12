var path = require('path')
var UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: './lib/restclient.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'GlpiRestClient.js',
        library: 'GlpiRestClient',
        libraryTarget: 'umd'
    },
    externals: [
        'url',
        'https'
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'stage-0']
                }
            }
        ]
    },
    plugins: [
        new UglifyJsPlugin()
    ],
    stats: {
        colors: true
    },
    devtool: 'source-map'
}
