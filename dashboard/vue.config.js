// vue.config.js
const { defineConfig } = require('@vue/cli-service')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

module.exports = defineConfig({
  transpileDependencies: true,

  configureWebpack: {
    plugins: [
      new BundleAnalyzerPlugin({
        analyzerMode: 'server',      // "server" öffnet automatisch localhost:[port]
        analyzerPort: 8853,          // Port für das UI
        openAnalyzer: true,          // Browser automatisch öffnen
        generateStatsFile: true,     // stats.json Datei erzeugen
        statsFilename: 'stats.json', // optionaler Name
      }),
    ],
  },
})
