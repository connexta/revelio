import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'

const rootReducer = () => ({})

const composeEnhancers =
  process.env.NODE_ENV === 'production'
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export { rootReducer }
