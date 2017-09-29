/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers, Reducer, Action } from 'redux'
import { createStore } from '../../../src'

class TestState {
    value: number
}

const testReducer: Reducer<TestState> = (state: TestState = { value: 0 }, action: Action) => {
    return state
}

const store = createStore(combineReducers<any>({ testReducer1: testReducer }))

store.attachReducers({ testestReducer2: testReducer })
