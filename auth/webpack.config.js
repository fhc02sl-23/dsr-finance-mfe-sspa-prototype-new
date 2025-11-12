const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "DSR",
    projectName: "auth",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    plugins: [ 
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8885,
        generateStatsFile: true,
      }),
    ],
    externals:['@DSR/data-utility','rxjs'],
    // modify the webpack config however you'd like to by adding to this object
  });
};
