import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import results from './results'

const rootReducer = combineReducers({ ...results })

const composeEnhancers =
  process.env.NODE_ENV === 'production'
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

export { rootReducer }
