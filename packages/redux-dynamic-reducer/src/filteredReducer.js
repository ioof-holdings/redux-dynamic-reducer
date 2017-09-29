/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

const FILTER_INIT = { type: '@@FILTER/INIT' }

const isObject = (obj) => {
  return obj === Object(obj) && !Array.isArray(obj)
}

const filteredReducer = (reducer) => {
    let knownKeys = Object.keys(reducer(undefined, FILTER_INIT))

    return (state, action) => {
        let filteredState = state

        if (knownKeys.length && state !== undefined) {
            filteredState = knownKeys.reduce((current, key) => {
                current[key] = state[key];
                return current
            }, {})
        }

        let newState = reducer(filteredState, action)

        if (newState === filteredState) {
            return state;
        }

        if (isObject(newState)) {
            knownKeys = Object.keys(newState)
            return {
                ...state,
                ...newState
            }
        } else {
            return newState
        }
    };
}

export default filteredReducer
