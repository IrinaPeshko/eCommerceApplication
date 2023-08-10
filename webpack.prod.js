const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
    mode: 'production',
    devtool: 'source-map',
    performance: {
        hints: false
    },
    plugins: [
      new MiniCssExtractPlugin({
          filename: './css/[name].css'
      }),
    ],
    module: {
      rules: [
          {
              test: /\.(c|sa|sc)ss$/i,
              use: [
                  MiniCssExtractPlugin.loader,
                  'css-loader',
                  'sass-loader'
              ]
          }
      ],
  },
});