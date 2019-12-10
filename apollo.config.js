module.exports = {
  client: {
    service: {
      name: 'intrigue-api',
      localSchemaFile: './schema.json',
    },
    includes: ['src/**/*.{ts,tsx,js,jsx}'],
  },
}
