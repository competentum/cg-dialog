var webpack = require('webpack');
var path = require('path');

var buildPath = path.resolve(__dirname, '.');

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: buildPath,
        filename: 'cg-dialog.js',
        library: 'CgDialog',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.less$/,
                loader: 'style!css!less'
            },
            {
                test: /\.css$/,
                loader: 'style!css'
            },
            {
                test: /\.(png|svg)$/i,
                loader: "url-loader?limit=100000"
            },

            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel',
                query: {
                    presets: ['es2015'],
                    plugins: ['add-module-exports']
                }
            }
        ]
    }
};