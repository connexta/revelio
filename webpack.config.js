const path = require('path')
const nodeExternals = require('webpack-node-externals')

const nodeResolve = place => require.resolve(place)

module.exports = {
  entry: {
    'intrigue-api': path.resolve(
      __dirname,
      'src/main/webapp/intrigue-api/library.js'
    ),
    components: path.resolve(__dirname, 'src/main/webapp/library.js'),
    'graphql-server': path.resolve(
      __dirname,
      'src/main/graphql-server/library.js'
    ),
  },
  output: {
    path: path.resolve(__dirname, './build/lib'),
    filename: '[name]/index.js',
    libraryTarget: 'umd',
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
}
