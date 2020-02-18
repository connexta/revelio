import React from 'react'
import { renderToString, renderToStaticMarkup } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { getDataFromTree } from '@apollo/react-ssr'
import { ServerStyleSheets } from '@material-ui/styles'
const { createServerApollo } = require('../../webapp/intrigue-api/graphql')
import { ApolloProvider } from '@apollo/react-hooks'
import Loadable from '@connexta/ace/react-loadable'
import { getBundles } from '@connexta/ace/react-loadable/webpack'

const ROOT_PATH = '/search/catalog'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Html = ({ content, state, css, scripts = [] }) => {
  return (
    <html>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__APOLLO_STATE__ = ${JSON.stringify(state)}`,
          }}
        />
        <style id="css-server-side" dangerouslySetInnerHTML={{ __html: css }} />
      </head>
      <body style={{ margin: 0 }}>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        {scripts.map(script => (
          <script key={script.publicPath} src={script.publicPath} />
        ))}
      </body>
    </html>
  )
}

export default ({ Routes, executableSchema, context }) => async req => {
  const { originalUrl, clientBundles } = req

  const sheets = new ServerStyleSheets()
  const client = createServerApollo({ executableSchema, context })({ req })

  try {
    await Loadable.preloadAll()
    let modules = new Set()

    const App = sheets.collect(
      <Loadable.Capture report={moduleName => modules.add(moduleName)}>
        <ApolloProvider client={client}>
          <StaticRouter
            location={originalUrl}
            basename={ROOT_PATH}
            context={{}}
          >
            <Routes />
          </StaticRouter>
        </ApolloProvider>
      </Loadable.Capture>
    )
    await getDataFromTree(App)
    await sleep(300)

    const modulesToBeLoaded = [
      ...clientBundles.entrypoints,
      ...Array.from(modules),
    ]

    // Reversing to ensure the main bundle is loaded last
    const bundles = getBundles(clientBundles, modulesToBeLoaded).js.reverse()

    const content = renderToString(App)
    const styling = sheets.toString()
    const initialState = client.extract()
    const html = (
      <Html
        content={content}
        state={initialState}
        css={styling}
        scripts={bundles}
      />
    )
    return `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
  } catch (e) {
    //eslint-disable-next-line
    console.error(e)

    // Reversing to ensure the main bundle is loaded before libs
    const bundles = getBundles(
      clientBundles,
      clientBundles.entrypoints
    ).js.reverse()

    const html = <Html content="" state={{}} scripts={bundles} />
    return `<!DOCTYPE html>\n${renderToStaticMarkup(html)}`
  }
}
