import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const defaultConfig = {
  GRAPHQL_BASE_URL: 'http://localhost:8080/graphql',
}

module.exports = key => {
  return publicRuntimeConfig[key] || defaultConfig[key]
}
