require('babel-polyfill')

const express = require('express')
const router = require('./middleware')
const compression = require('compression')
const app = express()
const port = process.env.EXPRESS_PORT || 4000
const path = require('path')
const fs = require('fs')
const uuid = require('node-uuid')
const httpContext = require('express-http-context')
const logger = require('./logger')
const cachedBundleManifest = JSON.parse(
  fs.readFileSync('target/webapp/react-loadable.json')
)

const { fancy } = require('./logger')

app.use(httpContext.middleware)
app.use(function(req, res, next) {
  httpContext.set('reqId', uuid.v1())
  next()
})

app.use(compression())

logger.debug(`Cached bundles read: ${fancy(cachedBundleManifest)}`)

app.use('/', (req, res, next) => {
  req.clientBundles = cachedBundleManifest
  next()
})
app.use('/', router)

const webapp = path.join('target/webapp/')
app.use('/search/catalog', express.static(webapp))

app.listen(port, () => {
  // eslint-disable-next-line no-console
  logger.info(`Server is running on port ${port}`)
})
