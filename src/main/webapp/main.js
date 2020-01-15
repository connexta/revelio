import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from '@connexta/ace/react-hot-loader'
import Loadable from 'react-loadable'
import App from './app'

const render = async App => {
  // TODO: Update render to be hydrate to improve performance
  await Loadable.preloadReady()
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,

    document.getElementById('root')
  )
}

render(App)

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept('./app', () => {
    render(require('./app').default)
  })
}
