const path = require('path')
const webpack = require('webpack')
const copyWebpackPlugin = require('copy-webpack-plugin')
const stylus = require('stylus')

const isBuild = !!process.env.BUILD || false
const baseName = isBuild ? '[name].[hash:8].[ext]' : '[name].[ext]'
const scriptName = isBuild ? 'scripts/[name].[chunkhash:8].js' : 'scripts/[name].js'

exports.entry = {
  'loading': [ './src/loading' ],
  'lib': [ './src/lib' ],
  'main': [ './src/main' ]
}

exports.output = {
  root: path.resolve('./dist'),
  path: path.resolve(__dirname, '../dist'),
  publicPath: './',
  filename: scriptName
}

exports.resolve = {
  extensions: ['', '.js', '.vue', '.html', '.styl'],
  alias: {
    'vue': 'vue/dist/vue.js'
  }
}

exports.loaders = [
  { test: /\.json$/, loader: 'json' },
  { test: /\.vue$/, loader: 'vue' },
  { test: /\.js$/, loader: 'babel', include: path.join(__dirname, '../src') },
  { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url', query: {limit: 100, name: `assets/images/${baseName}`}, exclude: /tb-icons\/lib\/svgs/ },
  { test: /\.svg$/, loaders: [ 'svg-sprite?' + JSON.stringify({name: 'ss-[name]'})], include: /tb-icons\/lib\/svgs/ },
  { test: /\.(woff2?)(\?.*)?$/, loader: 'url', query: {limit: 100, name: `assets/fonts/${baseName}`} },
  { test: /\.(mid)$/, loader: 'file', query: {name: `assets/midis/${baseName}`} }
]

exports.plugins = [
  new webpack.DefinePlugin({
    __DEBUG__: JSON.stringify(JSON.parse(!isBuild))
  }),
  copyWebpackPlugin([
    { from: './src/assets/soundfonts', to: './assets/soundfonts' },
  ]),
  new webpack.optimize.CommonsChunkPlugin({
    names: ['lib'],
    chunks: ['lib', 'main'],
    filename: scriptName,
    minChunks: Infinity
  })
]

exports.stylusConfig = {
  define: {
    url: stylus.resolver()
  }
}

exports.htmlOptions = {
  filename: './index.html',
  template: './src/index.html',
  inject: true
}
