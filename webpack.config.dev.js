/*eslint-disable */
var webpack = require("webpack");
var path = require("path");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');


module.exports = {
    resolve: {
        extensions: ['*', '.js', '.jsx', '.json']
    },
    devtool: 'eval-source-map', // more info:https://webpack.js.org/guides/development/#using-source-maps
    entry: [
        'babel-polyfill',
        'webpack/hot/dev-server',
        path.resolve(__dirname, 'src/index.js') // Defining path seems necessary for this to work consistently on Windows machines.
    ],
    target: 'web',
    output: {
        path: path.resolve(__dirname, 'dist/assets'), // Note: Physical files are only output by the production build task `npm run build`.
        publicPath: '/',
        filename: 'bundle.js'
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'), // Tells React to build in either dev or prod modes. https://facebook.github.io/react/downloads.html (See bottom)
            __DEV__: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // new CopyWebpackPlugin([
        //     {from: 'assets/css', to: 'css/'},
        //     {from: 'src/styles', to: 'customCss/'},
        //     {from: 'src/static-assets', to: 'images/'}

        // ]),
        new HtmlWebpackPlugin({
            template: 'src/index.html',
            dnsTrails: false,
            minify: {
                removeComments: false,
                collapseWhitespace: false,
                removeRedundantAttributes: false,
                useShortDoctype: false,
                removeEmptyAttributes: false,
                removeStyleLinkTypeAttributes: false,
                keepClosingSlash: false,
                minifyJS: false,
                minifyCSS: false,
                minifyURLs: false
            },
            inject: true,
            // Note that you can add custom options here if you need to handle other custom logic in index.html
            // To track JavaScript errors via TrackJS, sign up for a free trial at TrackJS.com and enter your token below.
            trackJSToken: ''
        }),
        new HtmlWebpackIncludeAssetsPlugin({
            assets: [
                {path: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css', type: 'css'},
                {path: 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js'},
                {path: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'}
            ],
            append: false,
            publicPath: ''
        })
    ],

    devServer: {
        contentBase: '/',
        inline: true,
        hot: true,
        historyApiFallback: {
            disableDotRule: true,
            htmlAcceptHeaders: ['text/html', 'application/xhtml+xml']
        }
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                  babelrc: path.join(process.cwd(), './babelrc')
                }
            },
            {test: /(\.css)$/, loaders: ['style-loader', 'css-loader?sourceMap']},
            {test: /\.(jpe?g|png|gif)$/i, loader: 'file-loader?name=[name].[ext]'},
            {test: /\.ico$/, loader: 'file-loader?name=[name].[ext]'},
            {test: /\.[ot]tf(\?v=\d+.\d+.\d+)?$/, loader: 'url-loader?limit=10000&mimetype=application/octet-stream'}          ]
            
            // {test: /(\.css)$/,
              // use: ['style-loader', {loader: 'css-loader', options: {minimize: true, sourceMap: true}}]}]
    }
};