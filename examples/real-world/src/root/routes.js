import React from 'react'
import { Route } from 'react-router'
import LoadableRoute from '../common/components/LoadableRoute'

export default (
  <Route path="/" component={LoadableRoute(import('../app'))}>
    <Route path="/:login/:name" component={LoadableRoute(import('../repoPage'))} />
    <Route path="/:login" component={LoadableRoute(import('../userPage'))} />
  </Route>
)
