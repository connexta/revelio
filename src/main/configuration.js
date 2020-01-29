const fs = require('fs')
const configurationPath = './config.json'
const defaultDdfUrl = 'https://localhost:8993'

let env = {}
try {
  if (fs.existsSync(configurationPath)) {
    env = JSON.parse(fs.readFileSync(configurationPath))
  }
} catch (err) {
  //eslint-disable-next-line
  console.error('Error reading in the environment configuration', err)
}

const defaultConfig = {
  LOG_LEVEL: 'info',
  GRAPHQL_CAPTURE: false,
  EXPRESS_PORT: 4000,
  CHAOS_ENABLED: false,
  FETCH_ORIGIN: defaultDdfUrl,
  DDF_LOCATION: defaultDdfUrl,
  TIMEOUT_INTERVAL: 5000,
}

module.exports = key => env[key] || process.env[key] || defaultConfig[key]
