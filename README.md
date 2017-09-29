# redux-dynamic-reducer

[![npm version](https://img.shields.io/npm/v/redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-dynamic-reducer)
[![npm downloads](https://img.shields.io/npm/dm/redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-dynamic-reducer)
[![License: MIT](https://img.shields.io/npm/l/redux-dynamic-reducer.svg?style=flat-square)](/LICENSE.md)

Use this library to attach additional reducer functions to an existing [Redux](http://redux.js.org/) store at runtime.

This solution is based on an example proposed by Dan Abramov in a [StackOverflow answer](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application#33044701).

## Why this library?

A Redux store's state tree is created from a single reducer function. [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) is the mechanism to compose many reducer functions into a single reducer that can be used to build a hierarchical the state tree. It is not possible to modify the reducer function after the store has been initialised.

This library allows you to attach new reducer functions after the store is initialised. This is helpful if you want to use a single global store across a lazily loaded application where not all reducers are available at store creation. It also provides a convenience functionality that pairs with [redux-subspace](https://github.com/ioof-holdings/redux-subspace) and allows combining a React component with a reducer that automatically attaches to the store when the component is mounted.

## The common use case

This library will help if you want to lazily load and execute pieces of your application but still manage your state in a global store. You can initialise the store in your first page load and efficiently load a skeleton app while the rest of your app is pulled down and loaded asynchronously.

This library pairs well with [redux-subspace](https://github.com/ioof-holdings/redux-subspace) for building complex single-page-applications composed of many decoupled micro frontends.

## Packages

* [`redux-dynamic-reducer`](/packages/redux-dynamic-reducer): The core package for `redux-dynamic-reducer`
* [`react-redux-dynamic-reducer`](/packages/react-redux-dynamic-reducer): React bindings for `redux-dynamic-reducer`

## How to use

### 1. Create the store

The `createStore` function replaces the [Redux `createStore` function](http://redux.js.org/docs/api/createStore.html). It adds the `attachReducers()` function to the store object. It also supports all the built in optional parameters:

```javascript
import { combineReducers } from 'redux'
import { createStore } from 'redux-dynamic-reducer'

...

const reducer = combineReducers({ staticReducer1, staticReducer2 })
const store = createStore(reducer)
```

```javascript
const store = createStore(reducer, { initial: 'state' })
```

```javascript
const store = createStore(reducer, applyMiddleware(middleware))
```

```javascript
const store = createStore(reducer, { initial: 'state' }, applyMiddleware(middleware))
```

### 2. Dynamically attach a reducer

#### Not using redux-subspace

Call `attachReducers` on the store with your dynamic reducers to attach them to the store at runtime:

```javascript
store.attachReducers({ dynamicReducer })
```

Multiple reducers can be attached as well:

```javascript
store.attachReducers({ dynamicReducer1, dynamicReducer2 })
```

#### When using React and redux-subspace

First, wrap the component with `withReducer`:

```javascript
// in child component
import { withReducer } from 'react-redux-dynamic-reducer

export default withReducer(myReducer, 'defaultKey')(MyComponent)
```

The `withReducer` higher-order component (HOC) bundles a reducer with a React component. `defaultKey` is used by redux-subspace to subspace the default instance of this component.

Mount your component somewhere inside a react-redux `Provider`:

```javascript
// in parent app/component
import MyComponent from './MyComponent'

<Provider store={store}>
    ...
      <MyComponent />
    ...
</Provider>
```

When the component is mounted, the reducer will be automatically attached to the Provided Redux store. It will also mount the component within a [subspace](https://github.com/ioof-holdings/redux-subspace) using the default key.

Multiple instances of the same component can be added by overriding the default subspace key with an instance specific key:

```javascript
// in parent app/component
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

Additional state can be mapped for the component or an instance of the component by providing an additional mapper:

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

By default, the components are [namespaced](https://github.com/ioof-holdings/redux-subspace#namespacing). If namespacing is not wanted for a component or and instance of the component, an options object can be provided to prevent it:

```javascript
export default withReducer(myReducer, 'defaultKey', { namespaceActions: false })(MyComponent)

...

const MyComponentInstance = MyComponent.createInstance('instance').withOptions({ namespaceActions: false })
```

## Examples

Examples can be found [here](/examples).

## Limitations

* Each dynamic reducer needs a unique key
  * If the same key is used, the last component to use it wins
* Currently, reducers are only ever attached at the root of the store. Nesting is a complex problem we are working on. Components can be nested as deep as required, but the store state tree will not match the nesting structure. Consequently, the subspace keys must be unique across the board.
