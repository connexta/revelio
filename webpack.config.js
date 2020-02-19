const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = ['source-map'].map(devtool => ({
  entry: {
    components: path.resolve(__dirname, 'src/main/webapp/library.js'),
  },
  devtool,
  output: {
    path: path.resolve(__dirname, './build/lib'),
    filename: '[name]/index.js',
    library: 'a-test-of-revelio',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /(node_modules)/,
        use: 'ts-loader',
      },
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ],
  },

  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
}))
