const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "DSR",
    projectName: "data-utility",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    plugins: [ 
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8857,
        generateStatsFile: true,
      }),
    ],
    externals:['rxjs'],
    // modify the webpack config however you'd like to by adding to this object
  });
};
