const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "DSR",
    projectName: "container",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    plugins: [ 
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerPort: 8886,
        generateStatsFile: true,
      }),
    ],
    externals:['rxjs'],
    // modify the webpack config however you'd like to by adding to this object
  });
};
