import React from 'react'
import { render } from 'react-dom'
import { createStore } from "redux"
import dynamicReducer from 'redux-dynamic-reducer'
import { Provider } from 'react-redux'

const store = createStore(null, dynamicReducer())

import('./components/App').then(module => module.default)
  .then(App => render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root')
  ))
