/*eslint-disable*/
var express = require('express');
var webpack = require('webpack');
var path = require('path');
const WebpackDevServer = require('webpack-dev-server');

var config = require('../webpack.config.dev');
var open = require('open');

/* eslint-disable no-console */

var port = 8080;
var app = express();
app.get('*', (req, res) => {
    res.sendFile(path.join( __dirname, '../src/index.html'));
});
var compiler = webpack(config);

const devServerOptions = Object.assign({}, config.devServer, {
    watchContentBase: true,
    stats: {
        colors: true
    },
    before(app) {
        app.use((req, res, next) => {
            console.log(`Using middleware for ${req.url}`);
            next();
        });
    }
});

const server = new WebpackDevServer(compiler, devServerOptions);


// app.use(require('webpack-dev-middleware')(compiler, {
//     noInfo: true,
//     publicPath: config.output.publicPath
// }));
//
// app.use(require('webpack-hot-middleware')(compiler));



server.listen(port, (err) => {
    err ? console.log(err) :  open(`http://localhost:${port}`);
});