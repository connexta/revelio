import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import properties from './properties'

import { reducers } from '../intrigue-api/lib/cache'

const rootReducer = combineReducers({ properties, ...reducers })

const composeEnhancers =
  process.env.NODE_ENV === 'production'
    ? compose
    : window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () =>
  createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))
