/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createStore as baseCreateStore, compose } from 'redux'
import dynamicReducerMiddleware from './dynamicReducerEnhancer'

const createStore = (reducer, preloadedState, enhancer) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      'Warning: createStore is deprecated and will be removed in a future release. Please use the store enhancer instead.'
    )
  }

  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (enhancer) {
    enhancer = compose(enhancer, dynamicReducerMiddleware())
  } else {
    enhancer = dynamicReducerMiddleware()
  }

  return baseCreateStore(reducer, preloadedState, enhancer)
}

export default createStore
