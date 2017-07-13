var path = require('path');
var webpack = require('webpack');
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
    // The configuration for the server-side rendering
    name: 'server-side rendering',
    context: path.join(__dirname, '..', 'app'),
    entry: {
      server: '../server/index'
    },
    target: 'node',
    node: {
      __dirname: false
    },
    devtool: 'sourcemap',
    output: {
      // The output directory as absolute path
      path: distPath,
      // The filename of the entry chunk as relative path inside the output.path directory
      filename: 'server.js',
      // The output path from the view of the Javascript
      publicPath: publicPath,
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: commonLoaders.concat({
          test: /\.css$/,
          use: 'css/locals?modules&importLoaders=1'
      })
    },
    resolve: {
      modules: [
        path.join(__dirname, '..', 'app'),
        'node_modules'
      ],
      extensions: ['*', '.js', '.jsx', '.css']
    },
    externals: externals,
    plugins: [
        // Order the modules and chunks by occurrence.
        // This saves space, because often referenced modules
        // and chunks get smaller ids.
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new webpack.IgnorePlugin(/vertx/),
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
        new webpack.BannerPlugin({
          banner: 'require("source-map-support").install();', 
          raw: true, 
          entryOnly: false 
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static'
        })
    ],
  }
];
