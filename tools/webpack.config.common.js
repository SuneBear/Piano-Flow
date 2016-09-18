const path = require('path')
const webpack = require('webpack')
const stylus = require('stylus')

// Phaser webpack config
const phaserModule = path.join(__dirname, '../node_modules/phaser/')
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js')
const pixi = path.join(phaserModule, 'build/custom/pixi.js')
const p2 = path.join(phaserModule, 'build/custom/p2.js')

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
    'phaser': phaser,
    'pixi': pixi,
    'p2': p2,
    'vue': 'vue/dist/vue.js'
  }
}

exports.loaders = [
  { test: /\.json$/, loader: 'json' },
  { test: /\.vue$/, loader: 'vue' },
  { test: /\.js$/, loader: 'babel', include: path.join(__dirname, '../src') },
  { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url', query: {limit: 100, name: `assets/images/${baseName}`}, exclude: /node_modules\/tb-icons\/lib\/svgs/ },
  { test: /\.svg$/, loaders: [ 'svg-sprite?' + JSON.stringify({name: 'ss-[name]'})], include: /node_modules\/tb-icons\/lib\/svgs/ },
  { test: /\.(woff2?)(\?.*)?$/, loader: 'url', query: {limit: 100, name: `assets/fonts/${baseName}`} },
  { test: /\.(mp3)$/, loader: 'file', query: {name: `assets/audios/${baseName}`} },
  { test: /pixi\.js/, loader: 'expose?PIXI' },
  { test: /phaser-split\.js$/, loader: 'expose?Phaser' },
  { test: /p2\.js/, loader: 'expose?p2' }
]

exports.plugins = [
  new webpack.DefinePlugin({
    __DEBUG__: JSON.stringify(JSON.parse(!isBuild))
  }),
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
