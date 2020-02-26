const url = require('url')
const defaultDdfUrl = 'https://localhost:8993'

const parsableAttributes = {
  FETCH_ORIGIN: () =>
    process.env['FETCH_ORIGIN'] && url.parse(process.env['FETCH_ORIGIN']),
  DDF_LOCATION: () =>
    process.env['DDF_LOCATION'] && url.parse(process.env['DDF_LOCATION']),
}

const defaultConfig = {
  // Default log level for debugging
  LOG_LEVEL: 'info',

  // Request tracing in graphql
  GRAPHQL_CAPTURE: false,

  // The port we are running the express web server on
  EXPRESS_PORT: 4000,

  // Chaos induced failures are used in development to force intermittent failures to evaluate behavior
  CHAOS_ENABLED: false,

  // Used to specify the origin of a request when federating out a request to a DDF
  FETCH_ORIGIN: url.parse(defaultDdfUrl),

  // Specifying the URL of a given DDF endpoint
  DDF_LOCATION: url.parse(defaultDdfUrl),

  // How long we want to wait for a network request to return a result before terminating the execution
  TIMEOUT_INTERVAL: 5000,
}

module.exports = key => {
  return (
    (typeof parsableAttributes[key] === 'function'
      ? parsableAttributes[key]()
      : undefined) ||
    process.env[key] ||
    defaultConfig[key]
  )
}
