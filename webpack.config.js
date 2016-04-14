var webpack = require('webpack');
var path = require('path');
var cgBanner = require('cg-components-banner');

var buildPath = path.resolve(__dirname, '.');

var pkg = require('./package.json');
var banner = pkg.name + ' v' + pkg.version + ' - ' + pkg.description + '\n'
    + cgBanner;

module.exports = {
    entry: path.resolve(__dirname, './src/index.js'),
    output: {
        path: buildPath,
        filename: 'cg-dialog.js',
        library: 'CgDialog',
        libraryTarget: 'umd'
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.BannerPlugin(banner)
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