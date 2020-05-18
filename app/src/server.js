const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0
const httpsOptions = {
  key: fs.readFileSync('../server.key'),
  cert: fs.readFileSync('../server.crt'),
}

app.prepare().then(() => {
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true)
    handle(req, res, parsedUrl)
  }).listen(3000, err => {
    if (err) throw err
    // eslint-disable-next-line no-console
    console.log('> Ready on https://localhost:3000')
  })
})
