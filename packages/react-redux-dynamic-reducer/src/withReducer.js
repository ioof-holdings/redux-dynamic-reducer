/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import PropTypes from 'prop-types'
import hoistNonReactStatics from 'hoist-non-react-statics';
import wrapDisplayName from 'recompose/wrapDisplayName'
import { namespaced } from 'redux-subspace'
import { subspaced } from 'react-redux-subspace'

const withReducer = (
    bundledReducer, 
    identifier, 
    { 
        namespaceActions = true,
        mapExtraState = () => undefined
    } = {}
) => {
    let namespace = undefined
    let reducer = bundledReducer
    const options = {
        namespaceActions,
        mapExtraState
    }

    if (options.namespaceActions) {
        namespace = identifier
        reducer = namespaced(namespace)(bundledReducer)
    }

    const mapState = (state, rootState) => ({ ...mapExtraState(state, rootState), ...rootState[identifier] })

    const subspaceEnhancer = subspaced(mapState, namespace)

    return (WrappedComponent) => {
        const Component = subspaceEnhancer(WrappedComponent)

        class ComponentWithReducer extends React.PureComponent {
            componentWillMount() {
                let attachReducersCheck = typeof this.context.store.attachReducers === 'function'

                if (process.env.NODE_ENV !== 'production') {
                    console.assert(attachReducersCheck, `'store.attachReducers' function is missing: Unable to attach reducer '${identifier}' into the store.`)
                }
                
                if (attachReducersCheck) {
                    this.context.store.attachReducers({ [identifier]: reducer })
                }
            }

            render() {
                return <Component {...this.props} />
            }
        }

        hoistNonReactStatics(ComponentWithReducer, Component)
        
        ComponentWithReducer.displayName = wrapDisplayName(Component, `ComponentWithReducer(${identifier})`)

        ComponentWithReducer.contextTypes = {
            store: PropTypes.object
        }

        ComponentWithReducer.createInstance = (instanceIdentfier) => {
            return withReducer(bundledReducer, instanceIdentfier, options)(WrappedComponent)
        }

        ComponentWithReducer.withExtraState = (mapExtraState) => {
            return withReducer(bundledReducer, identifier, { ...options, mapExtraState })(WrappedComponent)
        }

        ComponentWithReducer.withOptions = (overrideOptions) => {
            return withReducer(bundledReducer, identifier, { ...options, ...overrideOptions })(WrappedComponent)
        }

        return ComponentWithReducer
    }
}

export default withReducer
