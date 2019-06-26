const webpack = require('webpack');
const path = require('path');
const libraryName = 'redcube.node';

module.exports = {
    mode: 'development',
    target: 'node',
    entry: path.join(__dirname, `/src/${libraryName}.ts`),
    output: {
        filename: `${libraryName}.js`,
        path: path.join(__dirname, '/dist'),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    devServer: {
        publicPath: '/dist/'
    },
    devtool: "source-map",
    resolve: {extensions: ['.ts', '.js']},
    module: {
        rules: [ 
            { 
                test: /\.ts$/, 
                use: "awesome-typescript-loader?configFileName=tsconfig.server.json"
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: 'raw-loader'
            }, 
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                use: 'url-loader'
            } 
        ]
    }
};
