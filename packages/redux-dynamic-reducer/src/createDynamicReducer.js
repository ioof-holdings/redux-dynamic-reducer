/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import set from 'lodash.set'
import mergeWith from 'lodash.mergewith'
import { combineReducers } from 'redux'
import concatenateReducers from 'redux-concatenate-reducers'
import filteredReducer from './filteredReducer'

const createDynamicReducer = reducers => {
  if (typeof reducers === 'function') {
    return filteredReducer(reducers)
  }

  const expandedReducers = Object.keys(reducers).reduce((currentReducers, key) => {
    const reducerMap = set({}, key, reducers[key])

    return mergeWith(currentReducers, reducerMap, (originalReducer, newReducer) => {
      return originalReducer
        ? concatenateReducers([createDynamicReducer(originalReducer), createDynamicReducer(newReducer)])
        : newReducer
    })
  }, {})

  const flattenedReducers = Object.keys(expandedReducers).reduce((currentReducers, key) => {
    return { ...currentReducers, [key]: createDynamicReducer(expandedReducers[key]) }
  }, {})

  return filteredReducer(combineReducers(flattenedReducers))
}

export default createDynamicReducer
