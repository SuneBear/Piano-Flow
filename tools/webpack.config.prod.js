const path = require('path')
const webpack = require('webpack')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const commonConfig = require('./webpack.config.common')

module.exports = {
  entry: commonConfig.entry,
  output: commonConfig.output,
  resolve: commonConfig.resolve,
  module: {
    noParse: [/\.min\.js/],
    loaders: commonConfig.loaders.concat([
      { test: /\.styl$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!stylus', { publicPath: '../' }) },
    ])
  },
   plugins: commonConfig.plugins.concat([
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('styles/[name].[chunkhash:8].css'),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin(Object.assign(commonConfig.htmlOptions, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
      }
    }))
  ]),
  stylus: commonConfig.stylusConfig,
  vue: {
    loaders: {
      stylus: ExtractTextPlugin.extract('style', 'css!postcss!stylus')
    }
  },
  postcss: () => {
    return [
      autoprefixer({browsers: ['last 2 versions', 'ie 9-11']}),
      cssnano({ reduceIdents: false })
    ]
  }
}
