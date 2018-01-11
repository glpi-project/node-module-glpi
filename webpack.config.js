var path = require('path')

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
    stats: {
        colors: true
    },
    devtool: 'source-map'
}
