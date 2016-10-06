const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.config.common')

module.exports = {
  entry: commonConfig.entry,
  output: commonConfig.output,
  resolve: commonConfig.resolve,
  devtool: '#eval-source-map',
  watch: true,
  module: {
    noParse: [/\.min\.js/],
    preLoaders: [
      { test: /\.js$/, loader: 'standard', include: path.join(__dirname, '../src') }
    ],
    loaders: commonConfig.loaders.concat([
      { test: /\.styl$/, loader: 'style!css?sourceMap!stylus?sourceMap' },
    ])
  },
  plugins: commonConfig.plugins.concat([
    new HtmlWebpackPlugin(commonConfig.htmlOptions),
    // FIXME: Support HMR
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      open: false,
      server: {
        baseDir: ['./dist']
      }
    })
  ]),
  stylus: commonConfig.stylusConfig,
  standard: {
    parser: 'babel-eslint',
    global: [ '__DEBUG__' ]
  }
}
