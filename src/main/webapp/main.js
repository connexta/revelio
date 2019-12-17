import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from '@connexta/ace/react-hot-loader'
import App from './app'

const render = App => {
  // TODO: Update render to be hydrate to improve performance
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,

    document.getElementById('root')
  )
}

render(App)

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept('./intrigue-api/graphql', () => {
    render(require('./app').default)
  })
}
