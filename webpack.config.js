const path = require("path");
const webpack = require("webpack");

module.exports = {
    devtool: 'cheap-module.eval-source.map',
    entry: [
        path.resolve(__dirname, 'js/app.js')
    ],
    output: {
        path: path.resolve(__dirname, 'bundle'),
        filename: 'bundle.js'
    },
    plugins: [

    ],
    module: {
        loaders: [{
            test: /\.js$/,
            loaders: ['babel-loader'],
            exclude: /node_modules/,
            include: __dirname
        }]
    }
};
