/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers, Reducer, Dispatch, Action, applyMiddleware, Middleware, MiddlewareAPI } from 'redux'
import { createStore } from '../../../src'

class TestState {
  value: number
}

const testReducer: Reducer<TestState> = (state: TestState = { value: 0 }, action: Action) => {
  return state
}

const testEnhancer: Middleware = ({ dispatch, getState }) => next => action => next(action)

const store1 = createStore()

const store2 = createStore(combineReducers<any>({ testReducer }))

const store3 = createStore(combineReducers<any>({ testReducer }), { value: 1 })

const store4 = createStore(combineReducers<any>({ testReducer }), applyMiddleware(testEnhancer))

const store5 = createStore(combineReducers<any>({ testReducer }), { value: 1 }, applyMiddleware(testEnhancer))
