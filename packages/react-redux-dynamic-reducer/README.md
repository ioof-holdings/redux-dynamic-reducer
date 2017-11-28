# react-redux-dynamic-reducer

[![npm version](https://img.shields.io/npm/v/react-redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-dynamic-reducer)
[![npm downloads](https://img.shields.io/npm/dm/react-redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/react-redux-dynamic-reducer)
[![License: MIT](https://img.shields.io/npm/l/react-redux-dynamic-reducer.svg?style=flat-square)](/LICENSE.md)

This library provides [React bindings](https://facebook.github.io/react/) for [redux-dynamic-reducers](/packages/redux-dynamic-reducers), enabling reducers to be attached when components are mounted.

## How to use

### 1. Create the store

```javascript
import { createStore, combineReducers } from 'redux'
import dynamicReducer from 'redux-dynamic-reducer'

...

const reducer = combineReducers({ staticReducer1, staticReducer2 })
const store = createStore(reducer, dynamicReducer())
```

Please refer to the [redux-dynamic-reducer](/packages/redux-dynamic-reducer) for more details on creating the store.

### 2. Combine a component with a reducer

The `withReducer` higher-order component (HOC) can be used to bundle a reducer into a component that will automatically be attached into the store when mounted. This method will also mount the component within a [subspace](https://github.com/ioof-holdings/redux-subspace) for easy access to it's reducer.  Please refer to the [redux-subspace documentation](https://github.com/ioof-holdings/redux-subspace/docs) for configuring the subspace to work with any middleware, enhancers or other extensions you are using.

```javascript
import { withReducer } from 'react-redux-dynamic-reducer'

export default withReducer(myReducer, 'defaultKey')(MyComponent)
```

### 3. Mount the component

```javascript
import MyComponent from './MyComponent'

<Provider store={store}>
    ...
      <MyComponent />
    ...
</Provider>
```

Multiple instances of the same component can be added, as long as the have unique instance identifiers:

```javascript
import MyComponent from './MyComponent'

...

const MyComponent1 = MyComponent.createInstance('myInstance1')
const MyComponent2 = MyComponent.createInstance('myInstance2')

...

<Provider store={store}>
    <MyComponent1 />
    <MyComponent2 />
</Provider>
```

Additional state can be mapped for the component or an instance of the component my providing an additional mapper:

```javascript
export default withReducer(myReducer, 'defaultKey', { mapExtraState: (state, rootState) => ({ /* ... */ }) })(MyComponent)

...

const MyComponentInstance = MyComponent
    .createInstance('instance')
    .withExtraState((state, rootState) => ({ /* ... */ }) })

...

const MyComponentInstance = MyComponent
    .createInstance('instance')
    .withOptions({ mapExtraState: (state, rootState) => ({ /* ... */ }) })
```

The extra state is merged with the bundled reducer's state.

By default, the components are [namespaced](https://github.com/ioof-holdings/redux-subspace#namespacing).  If namespacing is not wanted for a component or and instance of the component, an options object can be provided to prevent it:

```javascript
export default withReducer(myReducer, 'defaultKey', { namespaceActions: false })(MyComponent)

...

const MyComponentInstance = MyComponent.createInstance('instance').withOptions({ namespaceActions: false })
```

Combined components and reducers can be nested as deep as required, but note, the nested reducer will appear at the top level of the redux state.

## Examples

Examples can be found [here](/examples#react-redux-dynamic-reducer).
