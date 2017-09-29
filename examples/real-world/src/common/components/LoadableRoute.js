import React from 'react'
import Loadable from 'react-loadable'

const Loading = () => <p>Loading...</p>

const LoadableRoute = (promise) => Loadable({
  loader: () => promise,
  loading: Loading,
  render(loaded, props) {
    let Component = loaded.default;
    return <Component {...props} />;
  }
})

export default LoadableRoute
