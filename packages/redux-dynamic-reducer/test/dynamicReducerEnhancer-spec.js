/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import dynamicReducerEnhancer from '../src/dynamicReducerEnhancer'

describe('dynamicReducerEnhancer Tests', () => {
  const staticReducer1 = (state = 0) => state
  const staticReducer2 = (state = 'test') => state

  it('should create store with static reducers', () => {
    const store = createStore(combineReducers({ staticReducer1, staticReducer2 }), dynamicReducerEnhancer())
    const state = store.getState()

    expect(state.staticReducer1).to.equal(0)
    expect(state.staticReducer2).to.equal('test')
  })

  it('should create store with no static reducers', () => {
    const store = createStore(null, dynamicReducerEnhancer())
    const state = store.getState()

    expect(state).to.be.undefined
  })

  it('should create store with initial state', () => {
    const store = createStore(combineReducers({ staticReducer1 }), { staticReducer1: 1 }, dynamicReducerEnhancer())
    const state = store.getState()

    expect(state.staticReducer1).to.equal(1)
  })

  it('should create store with middleware', () => {
    let called = false
    const middleware = () => next => action => {
      called = true
      return next(action)
    }

    const store = createStore(
      combineReducers({ staticReducer1 }),
      compose(applyMiddleware(middleware), dynamicReducerEnhancer())
    )

    store.dispatch({ type: 'TEST' })

    expect(called).to.be.true
  })

  it('should create store with initial state and middleware', () => {
    let called = false
    const middleware = () => next => action => {
      called = true
      return next(action)
    }

    const store = createStore(
      combineReducers({ staticReducer1 }),
      { staticReducer1: 1 },
      compose(applyMiddleware(middleware), dynamicReducerEnhancer())
    )

    store.dispatch({ type: 'TEST' })
    const state = store.getState()

    expect(state.staticReducer1).to.equal(1)
    expect(called).to.be.true
  })
})

describe('attachReducers Tests', () => {
  const staticReducer1 = (state = 0) => state
  const dynamicReducer1 = (state = { integer: 0, string: 'test' }) => state
  const dynamicReducer2 = (state = [0, 'test']) => state

  it('should attach dynamic reducer', () => {
    const store = createStore(combineReducers({ staticReducer1 }), dynamicReducerEnhancer())

    store.attachReducers({ dynamicReducer1 })

    const state = store.getState()

    expect(state.staticReducer1).to.equal(0)
    expect(state.dynamicReducer1.integer).to.equal(0)
    expect(state.dynamicReducer1.string).to.equal('test')
  })

  it('should attach multiple dynamic reducers', () => {
    const store = createStore(combineReducers({ staticReducer1 }), dynamicReducerEnhancer())

    store.attachReducers({ dynamicReducer1, dynamicReducer2 })

    const state = store.getState()

    expect(state.staticReducer1).to.equal(0)
    expect(state.dynamicReducer1.integer).to.equal(0)
    expect(state.dynamicReducer1.string).to.equal('test')
    expect(state.dynamicReducer2[0]).to.equal(0)
    expect(state.dynamicReducer2[1]).to.equal('test')
  })

  it('should attach multiple dynamic reducers at seperate times', () => {
    const store = createStore(combineReducers({ staticReducer1 }), dynamicReducerEnhancer())

    store.attachReducers({ dynamicReducer1 })
    store.attachReducers({ dynamicReducer2 })

    const state = store.getState()

    expect(state.staticReducer1).to.equal(0)
    expect(state.dynamicReducer1.integer).to.equal(0)
    expect(state.dynamicReducer1.string).to.equal('test')
    expect(state.dynamicReducer2[0]).to.equal(0)
    expect(state.dynamicReducer2[1]).to.equal('test')
  })
})
