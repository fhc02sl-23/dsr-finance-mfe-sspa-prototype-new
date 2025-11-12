const { merge } = require("webpack-merge");
const singleSpaDefaults = require("webpack-config-single-spa-react");

module.exports = (webpackConfigEnv, argv) => {
  const defaultConfig = singleSpaDefaults({
    orgName: "DSR",
    projectName: "basket",
    webpackConfigEnv,
    argv,
    outputSystemJS: false,
  });

  return merge(defaultConfig, {
    externals:['@DSR/data-utility','rxjs'],
    // modify the webpack config however you'd like to by adding to this object
  });
};
