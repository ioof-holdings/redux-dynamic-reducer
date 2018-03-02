import React from "react"
import ReactDOM from "react-dom"
import { createStore } from "redux"
import dynamicReducer from 'redux-dynamic-reducer'

const store = createStore(null, dynamicReducer())
const rootEl = document.getElementById("root")

const render = (Counter) => {
  ReactDOM.render(
    <Counter
      value={store.getState().dynamicCounter}
      onIncrement={() => store.dispatch({ type: "INCREMENT" })}
      onDecrement={() => store.dispatch({ type: "DECREMENT" })}
    />,
    rootEl
  )
}

const counterPromise = import('./components/Counter')
const reducerModule = import('./reducers')

Promise.all([reducerModule, counterPromise]).then(modules => {
  store.attachReducers({ dynamicCounter: modules[0].default })
  render(modules[1].default)
  store.subscribe(() => render(modules[1].default))
})
