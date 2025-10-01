import path from 'path';
const libraryName = 'redcube.node';
import nodeExternals from 'webpack-node-externals';

const __dirname = import.meta.dirname;

export default {
    mode: 'development',
    target: 'node20',
    externals: [nodeExternals()],
    entry: path.join(__dirname, `/src/${libraryName}.ts`),
    output: {
        filename: `${libraryName}.cjs`,
        chunkFilename: '[name].js',
        path: path.join(__dirname, '/dist'),
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    devServer: {
        publicPath: '/dist/'
    },
    devtool: process.env.NODE_ENV === 'development' && 'source-map',
    resolve: { extensions: ['.ts', '.js'] },
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
                test: /\.(jpeg|jpg|png|gif)$/,
                type: 'asset/inline'
            }
        ]
    }
};
