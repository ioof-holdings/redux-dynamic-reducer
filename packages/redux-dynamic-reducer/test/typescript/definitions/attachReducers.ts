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

store.attachReducers({ testReducer2: testReducer })

store.attachReducers({ testReducer3: testReducer, testReducer4: testReducer })

store.attachReducers({ nested: { testReducer5: testReducer } })
store.attachReducers({ 'nested.testReducer6': testReducer })
store.attachReducers({ 'nested/testReducer7': testReducer })


store.attachReducers({
    testReducer8: testReducer,
    nested: {
        testReducer9: testReducer,
        testReducer10: testReducer
    },
    'nested.testReducer11': testReducer,
    'nested/testReducer12': testReducer
})
