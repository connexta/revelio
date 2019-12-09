require('babel-polyfill')

const express = require('express')
const router = require('./middleware')
const compression = require('compression')
const app = express()
const port = process.env.EXPRESS_PORT || 4000

app.use(compression())
app.use('/', router)
app.use('/search/catalog', express.static('public'))

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
