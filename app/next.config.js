const withTM = require('next-transpile-modules')(['geospatialdraw', 'ol']) // pass the modules you would like to see transpiled
const CopyWebpackPlugin = require('copy-webpack-plugin')
const path = require('path')
const withCesium = (config, { isServer, webpack }) => {
  config.node = { ...config.node, fs: 'empty' }
  if (isServer) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.join(
              __dirname,
              'node_modules/cesium/Build/Cesium/Workers'
            ),
            to: '../public/Cesium/Workers',
          },
          {
            from: path.join(
              __dirname,
              'node_modules/cesium/Build/Cesium/ThirdParty'
            ),
            to: '../public/Cesium/ThirdParty',
          },
          {
            from: path.join(
              __dirname,
              'node_modules/cesium/Build/Cesium/Assets'
            ),
            to: '../public/Cesium/Assets',
          },
          {
            from: path.join(
              __dirname,
              'node_modules/cesium/Build/Cesium/Widgets'
            ),
            to: '../public/Cesium/Widgets',
          },
        ],
      })
    )
  }
  config.plugins.push(
    new webpack.DefinePlugin({
      // Define relative base path in cesium for loading assets
      CESIUM_BASE_URL: JSON.stringify('/Cesium'),
    })
  )
  return config
}

module.exports = withTM({
  webpack: withCesium,
  publicRuntimeConfig: {
    GRAPHQL_BASE_URL: process.env['GRAPHQL_BASE_URL'],
  },
})
