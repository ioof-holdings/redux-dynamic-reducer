/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import {
  createStore,
  combineReducers,
  compose,
  Reducer,
  Dispatch,
  Action,
  applyMiddleware,
  Middleware,
  MiddlewareAPI
} from 'redux'
import dynamicReducerEnhancer from '../../../src'

class TestState {
  value: number
}

const testReducer: Reducer<TestState> = (state: TestState = { value: 0 }, action: Action) => {
  return state
}

const testEnhancer: Middleware = ({ dispatch, getState }) => next => action => next(action)

const store1 = createStore(null, dynamicReducerEnhancer())

const store2 = createStore(combineReducers<any>({ testReducer }), dynamicReducerEnhancer())

const store3 = createStore(combineReducers<any>({ testReducer }), { value: 1 }, dynamicReducerEnhancer())

const store4 = createStore(
  combineReducers<any>({ testReducer }),
  compose(applyMiddleware(testEnhancer), dynamicReducerEnhancer())
)

const store5 = createStore(
  combineReducers<any>({ testReducer }),
  { value: 1 },
  compose(applyMiddleware(testEnhancer), dynamicReducerEnhancer())
)
