import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from '@connexta/ace/react-hot-loader'
import Routes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import createStore from './store'
import { createClient } from './intrigue-api/graphql'
import { ApolloProvider } from '@apollo/react-hooks'

const store = createStore()

const render = (Routes, client) => {
  if (typeof window !== 'undefined') {
    ReactDOM.render(
      application(Routes, client),
      document.getElementById('root')
    )
  } else {
    ReactDOM.hydrate(
      application(Routes, client),
      document.getElementById('root')
    )
  }
}

const application = (Routes, client) => {
  return (
    <AppContainer>
      <Provider store={store}>
        <ApolloProvider client={client}>
          <BrowserRouter basename="/search/catalog">
            <Routes />
          </BrowserRouter>
        </ApolloProvider>
      </Provider>
    </AppContainer>
  )
}

render(Routes, createClient())

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept('./routes', () => {
    render(require('./routes').default, createClient())
  })
  module.hot.accept('./store', () => {
    const { rootReducer } = require('./store')
    store.replaceReducer(rootReducer)
  })
  module.hot.accept('./intrigue-api/graphql', () => {
    const { createClient } = require('./intrigue-api/graphql')
    render(require('./routes').default, createClient())
  })
}
