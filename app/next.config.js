const withTM = require('next-transpile-modules')(['geospatialdraw', 'ol']) // pass the modules you would like to see transpiled

module.exports = withTM({
  publicRuntimeConfig: {
    GRAPHQL_BASE_URL: process.env['GRAPHQL_BASE_URL'],
  },
})
