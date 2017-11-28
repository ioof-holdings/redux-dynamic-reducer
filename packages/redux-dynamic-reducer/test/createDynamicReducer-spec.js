/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { combineReducers } from 'redux'
import createDynamicReducer from '../src/createDynamicReducer'

describe('nestedCombineReducers tests', () => {
  const reducer1 = (state = 'test1', action) => action.value1 || state
  const reducer2 = (state = 'test2', action) => action.value2 || state

  it('should combine reducers in single level', () => {
    const reducer = createDynamicReducer({
      reducer1,
      reducer2
    })

    const initialState = {
      reducer1: 'wrong',
      reducer2: 'wrong'
    }

    const actions = [{ value1: 'expected1' }, { value2: 'expected2' }]

    const state = actions.reduce(reducer, initialState)

    expect(state).to.deep.equal({
      reducer1: 'expected1',
      reducer2: 'expected2'
    })
  })

  it('should combine reducers in nested levels', () => {
    const reducer = createDynamicReducer({
      'parent1.reducer1': reducer1,
      'parent1.reducer2': reducer2,
      'parent2.parent3.reducer1': reducer1,
      'parent2.parent3.reducer2': reducer2
    })

    const initialState = {
      parent1: {
        reducer1: 'wrong',
        reducer2: 'wrong'
      },
      parent2: {
        parent3: {
          reducer1: 'wrong',
          reducer2: 'wrong'
        }
      }
    }

    const actions = [{ value1: 'expected1' }, { value2: 'expected2' }]

    const state = actions.reduce(reducer, initialState)

    expect(state).to.deep.equal({
      parent1: {
        reducer1: 'expected1',
        reducer2: 'expected2'
      },
      parent2: {
        parent3: {
          reducer1: 'expected1',
          reducer2: 'expected2'
        }
      }
    })
  })

  it('should combine reducers in different nested levels', () => {
    const reducer = createDynamicReducer({
      parent1: combineReducers({ reducer1 }),
      'parent1.reducer2': reducer2,
      'parent2.parent3': combineReducers({ reducer1 }),
      'parent2.parent3.reducer2': reducer2
    })

    const initialState = {
      parent1: {
        reducer1: 'wrong',
        reducer2: 'wrong'
      },
      parent2: {
        parent3: {
          reducer1: 'wrong',
          reducer2: 'wrong'
        }
      }
    }

    const actions = [{ value1: 'expected1' }, { value2: 'expected2' }]

    const state = actions.reduce(reducer, initialState)

    expect(state).to.deep.equal({
      parent1: {
        reducer1: 'expected1',
        reducer2: 'expected2'
      },
      parent2: {
        parent3: {
          reducer1: 'expected1',
          reducer2: 'expected2'
        }
      }
    })
  })
})
