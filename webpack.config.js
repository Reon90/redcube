import path from 'path';
import CopyPlugin from 'copy-webpack-plugin';
const libraryName = 'redcube';

const __dirname = import.meta.dirname;

export default {
    mode: 'development',
    entry: path.join(__dirname, `/src/${libraryName}.ts`),
    output: {
        filename: `${libraryName}.js`,
        chunkFilename: 'libs/[name].js',
        path: path.join(__dirname, '/dist'),
        library: 'redcube',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        assetModuleFilename: 'assets/[name][ext]'
    },
    devServer: {
        static: {
            directory: path.join(__dirname, '.')
        }
    },
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
                { from: './draco_decoder.wasm', to: './libs' },
                { from: './glslang.wasm', to: './libs' },
                { from: './twgsl.wasm', to: './libs' }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader'
            },
            {
                test: /\.(glsl|vert|frag|h)$/,
                type: 'asset/source'
            },
            {
                test: /\.hdr/,
                type: 'asset/resource'
            },
            {
                test: /\.(jpeg|jpg|png|gif)$/,
                type: 'asset/inline'
            }
        ]
    }
};
