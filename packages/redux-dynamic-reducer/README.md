# redux-dynamic-reducer

[![npm version](https://img.shields.io/npm/v/redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-dynamic-reducer)
[![npm downloads](https://img.shields.io/npm/dm/redux-dynamic-reducer.svg?style=flat-square)](https://www.npmjs.com/package/redux-dynamic-reducer)
[![License: MIT](https://img.shields.io/npm/l/redux-dynamic-reducer.svg?style=flat-square)](/LICENSE.md)

This is a library to create [Redux](http://redux.js.org/) stores that can have additional reducers dynamically attached at runtime.

It is based on an example proposed by Dan Abramov in a [StackOverflow answer](http://stackoverflow.com/questions/32968016/how-to-dynamically-load-reducers-for-code-splitting-in-a-redux-application#33044701).

## What it does

Redux only supports a single root reducer for the store. When designing the store structure, [`combineReducers`](http://redux.js.org/docs/api/combineReducers.html) can be used to combine multiple reducers into a single reducer for the store. However, you cannot add more reducers to the combination after the store has been created.

That's where this library fits in. It allows you to provide a single root reducer but also provide additional reducers to be merged into the root reducer after the store is created.

It also provides a useful utilities to package a component with a related reducer and attach it when the component is mounted.

## When to use it

* You do not know which reducers are required when creating the store.
* You want to split your bundle and some reducers will only be available after the import is resolved.

## How to use

### 1. Create the store

The `createStore` function can be used to create store that can have reducer dynamically attached. It is a drop-in replacement for the [built-in Redux version](http://redux.js.org/docs/api/createStore.html):

```javascript
import { combineReducers } from 'redux'
import { createStore } from 'redux-dynamic-reducer'

...

const reducer = combineReducers({ staticReducer1, staticReducer2 })
const store = createStore(reducer)
```

#### Initial State and Middleware

The `createStore` function also supports all of the optional parameters that the [built-in Redux `createStore` function](http://redux.js.org/docs/api/createStore.html) does:

```javascript
const store = createStore(reducer, { initial: 'state' })
```

```javascript
const store = createStore(reducer, applyMiddleware(middleware))
```

```javascript
const store = createStore(reducer, { initial: 'state' }, applyMiddleware(middleware))
```

### 2. Add a dynamic reducer

The store now has a new function on it caller `attachReducers`:

```javascript
store.attachReducers({ dynamicReducer })
```

Multiple reducers can be attached as well:

```javascript
store.attachReducers({ dynamicReducer1, dynamicReducer2 })
```

Reducers can also be added to nested locations in the store:

```javascript
store.attachReducers({
    some: {
        path: {
            to: {
                dynamicReducer
            }
        }
    }
} )
```

```javascript
store.attachReducers({ 'some.path.to': { dynamicReducer } } } })
```

```javascript
store.attachReducers({ 'some/path/to': { dynamicReducer } } } })
```

## Examples

Examples can be found [here](/examples#redux-dynamic-reducer).

## Limitations

* Each dynamic reducer needs a unique key
  * If the same key is used in a subsequent attachment, the original reducer will be replaced
* Nested reducers cannot be attached to nodes of the state tree owned by a static reducer
