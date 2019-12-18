require('babel-polyfill')

const express = require('express')
const router = require('./middleware')
const compression = require('compression')
const app = express()
const port = process.env.EXPRESS_PORT || 4000
const fs = require('fs')

app.use(compression())

// Memoize the manifest to reduce disk reads
let cachedBundleManifest = null
app.use('/', (req, res, next) => {
  if (cachedBundleManifest == null) {
    cachedBundleManifest = JSON.parse(
      fs.readFileSync('../webapp/react-loadable.json', 'utf8')
    )
  }
  req.clientBundles = cachedBundleManifest
  next()
})
app.use('/', router)
app.use('/search/catalog', express.static('../webapp'))

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on port ${port}`)
})
