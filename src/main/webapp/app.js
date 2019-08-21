import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from '@connexta/ace/react-hot-loader'
import Routes from './routes'
import { Provider } from 'react-redux'
import createStore from './store'

const store = createStore()

const render = Routes => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Routes />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  )
}

render(Routes)

if (process.env.NODE_ENV !== 'production') {
  module.hot.accept('./routes', () => render(require('./routes').default))
}
