const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require( 'eslint-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.html$/i,
                loader: 'html-loader'
            },
            {
                test: /\.ts$/i,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpe?g|webp|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'img/[name][ext]',
                },
            },
            {
                test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name][ext]'
                }
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts', '.json'],
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
        }),
        new ESLintPlugin({ extensions: 'ts' })
    ]
}