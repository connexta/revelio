import React from 'react'
import Routes, { hasPath } from '../../webapp/routes'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { getDataFromTree } from '@apollo/react-ssr'
import { ServerStyleSheets } from '@material-ui/styles'
import { createServerApollo } from '../../webapp/intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'
import fs from 'fs'

const ROOT_PATH = '/search/catalog'

const retrieveClientBundle = () => {
  return fs.readdirSync('./public').filter(file => {
    return file.match(/^bundle.[a-z0-9]+.\.js$/)
  })[0]
}

module.exports = async (req, res, next) => {
  const path = req.originalUrl.replace(ROOT_PATH, '')
  try {
    if (hasPath(path)) {
      const { originalUrl, clientBundle = retrieveClientBundle() } = req
      const html = await executeSSR(originalUrl, clientBundle)
      res.end(html)
    } else {
      next()
    }
  } catch (e) {
    process.stderr.write(e.message)
    res.status(500)
    res.end(e.message)
  }
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const executeSSR = async (originalUrl, clientBundle) => {
  const sheets = new ServerStyleSheets()
  const client = createServerApollo()

  const App = sheets.collect(
    <ApolloProvider client={client}>
      <StaticRouter location={originalUrl} basename={ROOT_PATH} context={{}}>
        <Routes />
      </StaticRouter>
    </ApolloProvider>
  )

  const Html = ({ content, state, css }) => {
    return (
      <html>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `window.__APOLLO_STATE__ = ${JSON.stringify(state)}`,
            }}
          />
          <style id="css-server-side">${css}</style>
        </head>
        <body style={{ margin: 0 }}>
          <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
          <script src={ROOT_PATH + '/' + clientBundle} />
        </body>
      </html>
    )
  }

  try {
    await getDataFromTree(App)
    await sleep(300)
    const content = renderToString(App)
    const styling = sheets.toString()
    const initialState = client.extract()
    const html = <Html content={content} state={initialState} css={styling} />
    return `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
  } catch (e) {
    const html = <Html content="" state={{}} />
    return `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
  }
}
