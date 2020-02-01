var path = require('path')
var utils = require('./utils')
var webpack = require('webpack')
var config = require('../config')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const WrapperPlugin = require('wrapper-webpack-plugin')
const userscriptMetaHelper = require('userscript-meta')
const metascript = require('../src/metascript')
metascript.version = require('../config/version').version
var CopyWebpackPlugin = require('copy-webpack-plugin')
// var HtmlWebpackPlugin = require('html-webpack-plugin')
// var ExtractTextPlugin = require('extract-text-webpack-plugin')
// var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CreateSha3ArrayPlugin = require('./webpackPlugins/CreateSha3ArrayPlugin')
const CreateAesArrayPlugin = require('./webpackPlugins/CreateAesArrayPlugin')
// var PrerenderSpaPlugin = require('prerender-spa-plugin')
var env = config.build.env

const plainHashes = require('../src/hashes/_hashes.plain')
const encryptees = require('../src/encryptees/_encryptees.plain')

var webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true
    })
  },
  devtool: config.build.productionSourceMap ? '#source-map' : false,
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': env
    }),
    new UglifyJSPlugin({
      sourceMap: config.build.productionSourceMap,
      warningsFilter: false,
      uglifyOptions: {
        compress: {
          warnings: false
        }
      }
    }),
    new WrapperPlugin({
      test: new RegExp(config.build.userscriptNamespace + '\\.user\\.js$'), // only wrap output of bundle files with '.js' extension
      header: function () {
        return userscriptMetaHelper.stringify(metascript)
      }
      // footer: ''
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   },
    //   sourceMap: config.build.productionSourceMap
    // }),
    // extract css into its own file
    // new ExtractTextPlugin({
    //   filename: utils.assetsPath('css/[name].[contenthash].css')
    // }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    // new OptimizeCSSPlugin(),
    // split vendor js into its own file
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: function (module, count) {
    //     // any required modules inside node_modules are extracted to vendor
    //     return (
    //       module.resource &&
    //       /\.js$/.test(module.resource) &&
    //       // /vue-wamp\.js$/.test(module.resource) === false &&
    //       module.resource.indexOf(
    //         path.join(__dirname, '../node_modules')
    //       ) === 0
    //     )
    //   }
    // }),
    // extract webpack runtime and module manifest to its own file in order to
    // prevent vendor hash from being updated whenever app bundle is updated
    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    //   chunks: ['vendor']
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../src/assets/public'),
        to: config.build.assetsSubDirectory /*+ config.build.assetsDocSubDirectory*/,
        // ignore: ['.*']
      }
    ]),
  ]
})

// webpackConfig.plugins.unshift(
//   new CreateAesArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/encryptees/jsApi.js',
//     content: encryptees.jsApi
//   })
// )
// webpackConfig.plugins.unshift(
//   new CreateAesArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/encryptees/reqBus.js',
//     content: encryptees.reqBus
//   })
// )
// webpackConfig.plugins.unshift(
//   new CreateAesArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/encryptees/cmdBus.js',
//     content: encryptees.cmdBus
//   })
// )
// webpackConfig.plugins.unshift(
//   new CreateAesArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/encryptees/eventBus.js',
//     content: encryptees.eventBus
//   })
// )
// webpackConfig.plugins.unshift(
//   new CreateAesArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/encryptees/discordWebhooks.js',
//     content: encryptees.discordWebhooks
//   })
// )
// webpackConfig.plugins.unshift(
//   new CreateSha3ArrayPlugin({
//     // path to folder in which the file will be created
//     path: config.build.sourceRoot,
//     fileName: '../src/hashes/networkKey.js',
//     content: plainHashes.networkKeys
//   })
// )

if (config.build.productionGzip) {
  var CompressionWebpackPlugin = require('compression-webpack-plugin')

  webpackConfig.plugins.push(
    new CompressionWebpackPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(' +
        config.build.productionGzipExtensions.join('|') +
        ')$'
      ),
      threshold: 10240,
      minRatio: 0.8
    })
  )
}

if (config.build.bundleAnalyzerReport) {
  var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig
