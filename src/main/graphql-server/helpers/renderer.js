import React from 'react'
import Routes from '../../webapp/routes'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { getDataFromTree } from '@apollo/react-ssr'
import { ServerStyleSheets } from '@material-ui/styles'
import { createClient } from '../../webapp/intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'

const ROOT_PATH = '/search/catalog'
const whitelistedSSRRoutes = [
  '/',
  `${ROOT_PATH}/`,
  `${ROOT_PATH}/search/`,
  `${ROOT_PATH}/search`,
  `${ROOT_PATH}/workspaces/`,
  `${ROOT_PATH}/workspaces`,
  `${ROOT_PATH}/sources/`,
  `${ROOT_PATH}/sources`,
  `${ROOT_PATH}/search-forms/`,
  `${ROOT_PATH}/search-forms`,
  `${ROOT_PATH}/result-forms/`,
  `${ROOT_PATH}/result-forms`,
  `${ROOT_PATH}/about`,
  `${ROOT_PATH}/about/`,
]

module.exports = (req, res, next) => {
  if (whitelistedSSRRoutes.includes(req.originalUrl)) {
    executeSSR(req, res, next)
  } else {
    next()
  }
}

const executeSSR = (req, res) => {
  const sheets = new ServerStyleSheets()
  const client = createClient(true)

  const App = sheets.collect(
    <ApolloProvider client={client}>
      <StaticRouter
        location={req.originalUrl}
        basename="/search/catalog"
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
          <script src={req.clientBundle} />
        </body>
      </html>
    )
  }

  return getDataFromTree(App).then(() => {
    setTimeout(() => {
      // Don't need both render markup and render string (remove)
      const content = renderToString(App)
      const styling = sheets.toString()
      const initialState = client.extract()
      const html = <Html content={content} state={initialState} css={styling} />
      const response = `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
      res.send(response)
      res.end()
    }, 150)
  })
}
