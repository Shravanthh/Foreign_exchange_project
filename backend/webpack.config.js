const path  = require('path');
const NodemonPlugin = require('nodemon-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: './src/index.ts',
    target: 'node',
    mode: 'development',
    module: {
        rules: [
            {
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.json', '.ts', '.js'],
    },
    output: {
        clean: true,
        path: path.resolve(__dirname, 'target'),
        chunkFormat: false,
        filename: '[name].js',
    },
    plugins: [
        new NodemonPlugin(),
    ],
    externals: [nodeExternals()]
};