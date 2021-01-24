const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");
const libraryName = 'redcube';

module.exports = {
    mode: 'development',
    entry: path.join(__dirname, `/src/${libraryName}.ts`),
    output: {
        filename: `${libraryName}.js`,
        chunkFilename: 'libs/[name].js',
        path: path.join(__dirname, '/dist'),
        publicPath: 'dist/',
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true,
        assetModuleFilename: 'assets/[name][ext]'
    },
    devServer: {
        publicPath: '/dist/',
        injectClient: false
    },
    devtool: process.env.NODE_ENV === 'development' && "source-map",
    resolve: {
        extensions: ['.ts', '.js'],
        fallback: {
            fs: false,
            path: false,
            crypto: false
        }
    },
    plugins: [
        new CopyPlugin({
          patterns: [
            { from: './libktx.wasm', to: './libs' },
            { from: './draco_decoder.wasm', to: './libs' }
          ]
        })
    ],
    module: {
        rules: [ 
            { 
                test: /\.ts$/, 
                use: "awesome-typescript-loader?configFileName=tsconfig.client.json"
            },
            {
                test: /\.(glsl|vert|frag)$/,
                use: 'raw-loader'
            },
            {
                test: /\.hdr/,
                type: 'asset/resource'
            },
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                use: 'url-loader'
            } 
        ]
    }
};
