const webpack = require('webpack');
const path = require('path');
const libraryName = 'redcube';

const config = {
    entry: path.join(__dirname, `/src/${libraryName}`),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: `${libraryName}.js`,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [{
            test: /(\.js)$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
        }]
    }
};

module.exports = config;