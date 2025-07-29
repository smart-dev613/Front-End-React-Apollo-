import { createStore, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'

import { rootReducer } from './root'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const store = createStore(
  rootReducer,
  window.INITIAL_STATE, // default state of the application
  composeEnhancers(
    applyMiddleware(thunk)
  )
)

export default store
