/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react'
import { Provider, connect } from 'react-redux'
import configureStore from 'redux-mock-store'
import { render } from 'enzyme'
import withReducer from '../src/withReducer'

describe('withReducer Tests', () => {

    const reducer = (state = 'reducer state') => state

    describe('component defaults', () => {
        it('should wrap standard component', () => {
            class TestComponent extends React.Component {
                render() {
                    return (
                        <p>{this.props.value}</p>
                    )
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent)

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap stateless component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent)

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap redux connected component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>
            const ConnectedComponent = connect(state => ({value: state.value}))(TestComponent)

            const mockStore = configureStore()({ default: { value: "expected" }})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(ConnectedComponent)

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should namespace component as default', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default')(TestComponent)

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].default("expected", { type: "TEST", payload: "wrong"})).to.equal("expected")
        })

        it('should namespace component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default', { namespace: true })(TestComponent)

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].default("expected", { type: "TEST", payload: "wrong"})).to.equal("expected")
        })

        it('should not namespace component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default', { namespaceActions: false })(TestComponent)

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].default("wrong", { type: "TEST", payload: "expected"})).to.equal("expected")
        })

        it('should map extra state for component', () => {
            const TestComponent = ({ value, otherValue }) => <p>{value} - {otherValue}</p>
            const ConnectedComponent = connect(state => ({ value: state.value, otherValue: state.otherValue }))(TestComponent)

            const mockStore = configureStore()({ default: { value: "expected" }, otherValue: "other"})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(ConnectedComponent)
                .withExtraState((state, rootState) => ({ otherValue: rootState.otherValue }))

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected - other')
        })

        it('should map extra state from options component', () => {
            const TestComponent = ({ value, otherValue }) => <p>{value} - {otherValue}</p>
            const ConnectedComponent = connect(state => ({ value: state.value, otherValue: state.otherValue }))(TestComponent)

            const mockStore = configureStore()({ default: { value: "expected" }, otherValue: "other" })
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default', { mapExtraState: (state, rootState) => ({ otherValue: rootState.otherValue }) })(ConnectedComponent)

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected - other')
        })

        it('should override options for component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()()
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent).withOptions({})

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap nested components', () => {

            const nestedReducer = (state = 'nested reducer state') => state

            const mockStore = configureStore()({ default2: { value: "expected" }, default1: { value: "wrong" } })
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent1 = withReducer(nestedReducer, 'default2')(connect(state => ({value: state.value}))(({ value }) => <p>{value}</p>))
            let DecoratedComponent2 = withReducer(reducer, 'default1')(() => <DecoratedComponent1 />)

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent2 />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
            expect(mockStore.attachReducers.args[0][0].default1()).to.equal('reducer state')
            expect(mockStore.attachReducers.args[1][0].default2()).to.equal('nested reducer state')
        })

        it('should raise error if store cannot have reducers attached', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()({})

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent)

            expect(() => render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )).to.throw("store.attachReducers' function is missing: Unable to attach reducer 'default' into the store.")
        })

        it('should not raise error if store cannot have reducers attached in production', () => {
            const nodeEnv = process.env.NODE_ENV

            try {
                process.env.NODE_ENV = 'production'

                const TestComponent = ({ value }) => <p>{value}</p>

                const mockStore = configureStore()({})

                let DecoratedComponent = withReducer(reducer, 'default')(TestComponent)

                let testComponent = render(
                    <Provider store={mockStore}>
                        <DecoratedComponent value="expected" />
                    </Provider>
                )

                expect(testComponent.text()).to.equal('expected')
            } finally {
                process.env.NODE_ENV = nodeEnv
            }
        })
    })

    describe('component instance', () => {
        it('should wrap standard component', () => {
            class TestComponent extends React.Component {
                render() {
                    return (
                        <p>{this.props.value}</p>
                    )
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent).createInstance('instance')

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap stateless component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent).createInstance('instance')

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap redux connected component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>
            const ConnectedComponent = connect(state => ({value: state.value}))(TestComponent)

            const mockStore = configureStore()({ instance: { value: "expected" }})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(ConnectedComponent).createInstance('instance')

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should namespace component as default', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default')(TestComponent).createInstance('instance')

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].instance("expected", { type: "TEST", payload: "wrong"})).to.equal("expected")
        })

        it('should namespace component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default', { namespace: true })(TestComponent).createInstance('instance')

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].instance("expected", { type: "TEST", payload: "wrong"})).to.equal("expected")
        })

        it('should not namespace component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const reducerWithAction = (state = {}, action) => {
                switch(action.type) {
                    case "TEST": 
                    return action.payload
                    default: 
                    return state
                }
            }

            const mockStore = configureStore()({})
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducerWithAction, 'default', { namespaceActions: false })(TestComponent).createInstance('instance')

            render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(mockStore.attachReducers.args[0][0].instance("wrong", { type: "TEST", payload: "expected"})).to.equal("expected")
        })

        it('should map extra state for component', () => {
            const TestComponent = ({ value, otherValue }) => <p>{value} - {otherValue}</p>
            const ConnectedComponent = connect(state => ({ value: state.value, otherValue: state.otherValue }))(TestComponent)

            const mockStore = configureStore()({ instance: { value: "expected" }, otherValue: "other" })
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(ConnectedComponent)
                .createInstance('instance')
                .withExtraState((state, rootState) => ({ otherValue: rootState.otherValue }))

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected - other')
        })

        it('should map extra state from options component', () => {
            const TestComponent = ({ value, otherValue }) => <p>{value} - {otherValue}</p>
            const ConnectedComponent = connect(state => ({ value: state.value, otherValue: state.otherValue }))(TestComponent)

            const mockStore = configureStore()({ instance: { value: "expected" }, otherValue: "other" })
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default', { mapExtraState: (state, rootState) => ({ otherValue: rootState.otherValue }) })(ConnectedComponent)
                .createInstance('instance')

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected - other')
        })

        it('should override options for component', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()()
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent)
                .createInstance('instance')
                .withOptions({})

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
        })

        it('should wrap nested components', () => {

            const nestedReducer = (state = 'nested reducer state') => state

            const mockStore = configureStore()({ instance2: { value: "expected" }, instance1: { value: "wrong" } })
            mockStore.attachReducers = sinon.spy()

            let DecoratedComponent1 = withReducer(nestedReducer, 'default2')(connect(state => ({value: state.value}))(({ value }) => <p>{value}</p>)).createInstance('instance2')
            let DecoratedComponent2 = withReducer(reducer, 'default1')(() => <DecoratedComponent1 />).createInstance('instance1')

            let testComponent = render(
                <Provider store={mockStore}>
                    <DecoratedComponent2 />
                </Provider>
            )

            expect(testComponent.text()).to.equal('expected')
            expect(mockStore.attachReducers.args[0][0].instance1()).to.equal('reducer state')
            expect(mockStore.attachReducers.args[1][0].instance2()).to.equal('nested reducer state')
        })

        it('should raise error if store cannot have reducers attached', () => {
            const TestComponent = ({ value }) => <p>{value}</p>

            const mockStore = configureStore()({})

            let DecoratedComponent = withReducer(reducer, 'default')(TestComponent).createInstance('instance')

            expect(() => render(
                <Provider store={mockStore}>
                    <DecoratedComponent value="expected" />
                </Provider>
            )).to.throw("store.attachReducers' function is missing: Unable to attach reducer 'instance' into the store.")
        })

        it('should not raise error if store cannot have reducers attached in production', () => {
            const nodeEnv = process.env.NODE_ENV

            try {
                process.env.NODE_ENV = 'production'

                const TestComponent = ({ value }) => <p>{value}</p>

                const mockStore = configureStore()({})

                let DecoratedComponent = withReducer(reducer, 'default')(TestComponent).createInstance('instance')

                let testComponent = render(
                    <Provider store={mockStore}>
                        <DecoratedComponent value="expected" />
                    </Provider>
                )

                expect(testComponent.text()).to.equal('expected')
            } finally {
                process.env.NODE_ENV = nodeEnv
            }
        })
    })
})