require('babel-polyfill')

const express = require('express')
const config = require('../configuration')
const router = require('./middleware')
const compression = require('compression')
const app = express()
const port = config('EXPRESS_PORT')
const path = require('path')
const fs = require('fs')
const cachedBundleManifest = JSON.parse(
  fs.readFileSync('target/webapp/react-loadable.json')
)

app.use(compression())

app.use('/', (req, res, next) => {
  req.clientBundles = cachedBundleManifest
  next()
})
app.use('/', router)

const webapp = path.join('target/webapp/')
app.use('/search/catalog', express.static(webapp))

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})
