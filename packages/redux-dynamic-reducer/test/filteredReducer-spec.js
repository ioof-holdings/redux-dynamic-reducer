/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers, createStore } from 'redux'
import filteredReducer from '../src/filteredReducer'

describe('filteredReducer Tests', () => {
  const primative = (state = 0) => state
  const plainObject = (state = { test: 'value' }) => state
  const array = (state = ['value']) => state
  const changingState = (state = {}, action) => (action.type == 'ADD_STATE' ? { ...state, test: 'value' } : state)

  const testCases = [
    {
      name: 'combined',
      reducer: () => combineReducers({ primative, plainObject }),
      initialState: { primative: 1, plainObject: { test: 'other' } },
      expectedState1: { primative: 0, plainObject: { test: 'value' } },
      expectedState2: { primative: 0, plainObject: { test: 'value' } },
      expectedState3: { primative: 1, plainObject: { test: 'other' } },
      expectedState4: { primative: 1, plainObject: { test: 'other' } }
    },
    {
      name: 'primative',
      reducer: () => primative,
      initialState: 1,
      expectedState1: 0,
      expectedState2: 0,
      expectedState3: 1,
      expectedState4: 1
    },
    {
      name: 'plain object',
      reducer: () => plainObject,
      initialState: { test: 'other' },
      expectedState1: { test: 'value' },
      expectedState2: { test: 'value' },
      expectedState3: { test: 'other' },
      expectedState4: { test: 'other' }
    },
    {
      name: 'array',
      reducer: () => array,
      initialState: ['other'],
      expectedState1: ['value'],
      expectedState2: ['value'],
      expectedState3: ['other'],
      expectedState4: ['other']
    },
    {
      name: 'changing state',
      reducer: () => changingState,
      initialState: { test: 'other' },
      expectedState1: {},
      expectedState2: { test: 'value' },
      expectedState3: { test: 'other' },
      expectedState4: { test: 'value' }
    }
  ]

  testCases.forEach(testCase => {
    describe(`${testCase.name} reducers`, () => {
      it('should filter', () => {
        const store = createStore(filteredReducer(testCase.reducer()))

        expect(store.getState()).to.deep.equal(testCase.expectedState1)
      })

      it('should filter and handle actions', () => {
        const store = createStore(filteredReducer(testCase.reducer()))

        store.dispatch({ type: 'ADD_STATE' })

        expect(store.getState()).to.deep.equal(testCase.expectedState2)
      })

      it('should filter with initial state', () => {
        const store = createStore(filteredReducer(testCase.reducer()), testCase.initialState)

        expect(store.getState()).to.deep.equal(testCase.expectedState3)
      })

      it('should filter with initial state and handle actions', () => {
        const store = createStore(filteredReducer(testCase.reducer()), testCase.initialState)

        store.dispatch({ type: 'ADD_STATE' })

        expect(store.getState()).to.deep.equal(testCase.expectedState4)
      })
    })
  })
})
