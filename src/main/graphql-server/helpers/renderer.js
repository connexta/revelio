import React from 'react'
import Routes, { hasPath } from '../../webapp/routes'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { getDataFromTree } from '@apollo/react-ssr'
import { ServerStyleSheets } from '@material-ui/styles'
import { createClient } from '../../webapp/intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'

const ROOT_PATH = '/search/catalog'

module.exports = (req, res, next) => {
  const path = req.originalUrl.replace(ROOT_PATH, '')
  try {
    if (hasPath(path)) {
      executeSSR(req, res, next)
    } else {
      next()
    }
  } catch (e) {
    res.status(500)
    res.end(e.message)
    console.log(e)
  }
}

const executeSSR = (req, res) => {
  const sheets = new ServerStyleSheets()
  const client = createClient({ ssrMode: true })

  const App = sheets.collect(
    <ApolloProvider client={client}>
      <StaticRouter
        location={req.originalUrl}
        basename={ROOT_PATH}
        context={{}}
      >
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
          <script src={ROOT_PATH + '/' + req.clientBundle} />
        </body>
      </html>
    )
  }

  return getDataFromTree(App).then(() => {
    setTimeout(() => {
      const content = renderToString(App)
      const styling = sheets.toString()
      const initialState = client.extract()
      const html = <Html content={content} state={initialState} css={styling} />
      const response = `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
      res.send(response)
      res.end()
    }, 300)
  })
}
