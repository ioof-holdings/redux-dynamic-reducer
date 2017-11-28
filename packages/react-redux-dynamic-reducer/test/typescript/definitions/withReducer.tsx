/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'
import { withReducer } from '../../../src'

const reducer = (state = {}) => state

class MyStandardComponent extends React.Component<any, any> {
  render() {
    return <div />
  }
}

const MyStatelessComponent = () => {
  return <div />
}

const DecoratedStandardComponent = withReducer(reducer, 'standard')(MyStandardComponent)
const DecoratedStatelessComponent = withReducer(reducer, 'stateless')(MyStatelessComponent)

const DecoratedInstanceOfStandardComponent = withReducer(reducer, 'standard')(MyStandardComponent).createInstance(
  'instance'
)
const DecoratedInstanceOfStatelessComponent = withReducer(reducer, 'stateless')(MyStatelessComponent).createInstance(
  'instance'
)

const DecoratedStandardComponentWithExtraState = withReducer(reducer, 'standard')(MyStandardComponent).withExtraState(
  (state: {}) => ({ test: 'value' })
)
const DecoratedStatelessComponentWithExtraState = withReducer(reducer, 'standard')(MyStatelessComponent).withExtraState(
  (state: {}) => ({ test: 'value' })
)

const DecoratedStandardComponentWithExtraAndRootState = withReducer(reducer, 'standard')(
  MyStandardComponent
).withExtraState((state: {}, rootState: {}) => ({ test: 'value' }))
const DecoratedStatelessComponentWithExtraAndRootState = withReducer(reducer, 'standard')(
  MyStatelessComponent
).withExtraState((state: {}, rootState: {}) => ({ test: 'value' }))

const DecoratedStandardComponentWithDefaultOptions = withReducer(reducer, 'standard', {
  namespaceActions: false,
  mapExtraState: (state: {}, rootState: {}) => ({ test: 'value' })
})(MyStandardComponent)
const DecoratedStatelessComponentWithDefaultOptions = withReducer(reducer, 'stateless', {
  namespaceActions: false,
  mapExtraState: (state: {}, rootState: {}) => ({ test: 'value' })
})(MyStatelessComponent)

const DecoratedStandardComponentWithEmptyOptions = withReducer(reducer, 'standard', {})(MyStandardComponent)
const DecoratedStatelessComponentWithEmptyOptions = withReducer(reducer, 'stateless', {})(MyStatelessComponent)

const DecoratedStandardComponentWithInstanceOptions = withReducer(reducer, 'standard')(MyStandardComponent).withOptions(
  { namespaceActions: false }
)
const DecoratedStatelessComponentWithInstanceOptions = withReducer(reducer, 'stateless')(
  MyStatelessComponent
).withOptions({ namespaceActions: false })

const TestInJSX = () => (
  <div>
    <DecoratedStandardComponent />
    <DecoratedStatelessComponent />
    <DecoratedInstanceOfStandardComponent />
    <DecoratedInstanceOfStatelessComponent />
    <DecoratedStandardComponentWithExtraState />
    <DecoratedStatelessComponentWithExtraState />
    <DecoratedStandardComponentWithExtraAndRootState />
    <DecoratedStatelessComponentWithExtraAndRootState />
    <DecoratedStandardComponentWithDefaultOptions />
    <DecoratedStatelessComponentWithDefaultOptions />
    <DecoratedStandardComponentWithEmptyOptions />
    <DecoratedStatelessComponentWithEmptyOptions />
    <DecoratedStandardComponentWithInstanceOptions />
    <DecoratedStatelessComponentWithInstanceOptions />
  </div>
)
