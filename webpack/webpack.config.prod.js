var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
// remove for main prodution build - TODO: add argument to activate
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var commonConfig = require('./common.config');
var commonLoaders = commonConfig.commonLoaders;
var externals = commonConfig.externals;
var assetsPath = commonConfig.output.assetsPath;
var distPath = commonConfig.output.distPath;
var publicPath = commonConfig.output.publicPath;

module.exports = [
  {
    // The configuration for the client
    name: 'browser',
    /* The entry point of the bundle
     * Entry points for multi page app could be more complex
     * A good example of entry points would be:
     * entry: {
     *   pageA: "./pageA",
     *   pageB: "./pageB",
     *   pageC: "./pageC",
     *   adminPageA: "./adminPageA",
     *   adminPageB: "./adminPageB",
     *   adminPageC: "./adminPageC"
     * }
     *
     * We can then proceed to optimize what are the common chunks
     * plugins: [
     *  new CommonsChunkPlugin("admin-commons.js", ["adminPageA", "adminPageB"]),
     *  new CommonsChunkPlugin("common.js", ["pageA", "pageB", "admin-commons.js"], 2),
     *  new CommonsChunkPlugin("c-commons.js", ["pageC", "adminPageC"]);
     * ]
     */
    // SourceMap without column-mappings
    devtool: 'cheap-module-source-map',
    context: path.join(__dirname, '..'),
    entry: {
      app: ['./app/client']
    },
    output: {
      // The output directory as absolute path
      path: path.join(assetsPath, 'build'),
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].js',
      // The output path from the view of the Javascript
      publicPath: publicPath

    },
    module: {
      rules: commonLoaders.concat(
        {
          test: /\.scss$/i,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader', 'import-glob-loader']
          })
        }
      )
    },
    resolve: {
      modules: [
        path.join(__dirname, '..', 'app'),
        'node_modules'
      ],
      extensions: ['*', '.js', '.jsx', '.css']
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
          name: "vendor",
          minChunks: function (module) {
            // This prevents stylesheet resources with the .css or .scss extension
            // from being moved from their original chunk to the vendor chunk
            if(module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
              return false;
            }
            // this assumes your vendor imports exist in the node_modules directory
            return module.context && module.context.indexOf("node_modules") !== -1;
          }
        }),
        new webpack.optimize.CommonsChunkPlugin({
          name: "manifest",
          filename: 'manifest.js',
          chunks: ["vendor"],
          minChunks: Infinity
        }),
        new ChunkManifestPlugin({
          filename: 'manifest.json',
          manifestVariable: 'webpackManifest',
          inlineManifest: false
        }),
        // extract inline css from modules into separate files
        new ExtractTextPlugin({
          filename: '/css/styles.css',
          disable: false,
          allChunks: true 
        }),
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.optimize.UglifyJsPlugin({
          beautify: false,
          mangle: {
            screw_ie8: true,
            keep_fnames: true
          },
          compress: {
            screw_ie8: true,
            warnings: false
          },
          output: {
            comments: false
          }
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
  }
];
