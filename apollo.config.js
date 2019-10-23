const fs = require('fs')
const tempfile = require('tempfile')
const { genSchema } = require('./src/main/webapp/intrigue-api/gen-schema')
const path = tempfile('schema.graphql')
fs.writeFileSync(path, genSchema())

module.exports = {
  client: {
    service: {
      name: 'intrigue-api',
      localSchemaFile: path,
    },
    includes: ['src/**/*.{ts,tsx,js,jsx}'],
  },
}
