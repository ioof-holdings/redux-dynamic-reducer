/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import flattenReducers from '../src/flattenReducers'

describe('flattenReducers Tests', () => {
    const reducer = () => null
    
    it('should not change basic reducer structure', () => {
        const reducers = {
            parent1: reducer,
            parent2: reducer
        }

        const flattenedReducers = flattenReducers(reducers)

        expect(flattenedReducers).to.deep.equal({
            parent1: reducer,
            parent2: reducer
        })
    })

    it('should flatten reducer structure', () => {
        const reducers = {
            parent1: {
                parent2: reducer
            }
        }

        const flattenedReducers = flattenReducers(reducers)

        expect(flattenedReducers).to.deep.equal({
            'parent1/parent2': reducer
        })
    })

    it('should flatten deeply nested reducer structure', () => {
        const reducers = {
            parent1: {
                parent2: {
                    parent3: reducer
                }
            }
        }

        const flattenedReducers = flattenReducers(reducers)

        expect(flattenedReducers).to.deep.equal({
            'parent1/parent2/parent3': reducer
        })
    })
    
    it('should flatten differently nested reducer structure', () => {
        const reducers = {
            parent1: {
                parent2: reducer,
                parent3: reducer
            },
            parent3: {
                parent4: reducer,
                parent5: {
                    parent6: reducer
                }
            },
            parent7: reducer
        }

        const flattenedReducers = flattenReducers(reducers)

        expect(flattenedReducers).to.deep.equal({
            'parent1/parent2': reducer,
            'parent1/parent3': reducer,
            'parent3/parent4': reducer,
            'parent3/parent5/parent6': reducer,
            'parent7': reducer
        })
    })
})
