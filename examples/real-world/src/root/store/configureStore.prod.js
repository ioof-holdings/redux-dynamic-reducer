import { createStore, compose } from "redux"
import dynamicReducer from 'redux-dynamic-reducer'
import { applyMiddleware } from 'redux-subspace'
import thunk from 'redux-thunk'
import api from '../../common/middleware/api'
import wormhole from 'redux-subspace-wormhole'
import rootReducer from '../reducers'

const configureStore = preloadedState => createStore(
  rootReducer,
  preloadedState,
  compose(
    applyMiddleware(
      thunk, 
      api, 
      wormhole((state) => state.configuration, 'configuration')
    ),
    dynamicReducer()
  )
)

export default configureStore
