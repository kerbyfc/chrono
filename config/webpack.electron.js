const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
    mode,
    target: 'node',
    devtool: prod ? false : 'source-map',

    entry: {
        'electron': ['./src/electron/index.js'],
    },

    optimization: {
		minimize: false
	},

    externals: [nodeExternals()],

    resolve: {
        modules: ['node_modules'],
        extensions: ['.js', '.ts'],
    },

    output: {
        path: path.join(__dirname, '..', 'dist'),
        filename: 'index.js',
        chunkFilename: '[name].[id].js'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
            },
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new CopyPlugin([
            { from: 'src/electron/index.html' },
        ]),
    ],
};
