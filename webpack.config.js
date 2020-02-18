const path = require('path')
// const nodeExternals = require('webpack-node-externals')

const nodeResolve = place => require.resolve(place)

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
  },
  externals: [
    'react',
    /@material-ui\/.*/,
    /^@?apollo*/,
    'immutable',
    'graphql-tag',
    'react-hot-loader',
  ],
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
          loader: nodeResolve('babel-loader'),
          options: {
            presets: [nodeResolve('@babel/preset-react')],
            cacheDirectory: true,
            plugins: [
              nodeResolve('react-hot-loader/babel'),
              nodeResolve('react-loadable/babel'),
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx', '.ts', '.tsx'],
  },
}))
