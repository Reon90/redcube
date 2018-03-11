const webpack = require('webpack');
const path = require('path');
const libraryName = 'redcube';

const config = {
    entry: path.join(__dirname, `/src/${libraryName}.ts`),
    output: {
        path: path.join(__dirname, '/dist'),
        filename: `${libraryName}.js`,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devtool: "cheap-eval-source-map",
    resolve: {extensions: ['.ts', '.js']},
    module: {
        rules: [ 
            { 
                test: /\.ts$/, 
                use: "awesome-typescript-loader" 
            },
            {
                test: /\.glsl$/,
                use: 'raw-loader'
            }, 
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                use: 'url-loader'
            } 
        ]
    }
};

module.exports = config;