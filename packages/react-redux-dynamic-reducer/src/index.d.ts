/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import * as React from 'react'
import { Reducer } from 'redux'
import { MapState } from 'redux-subspace'

interface Options {
  namespaceActions?: Boolean
  mapExtraState?: MapState<any, any, any>
}

interface ComponentWithReducer<TProps> extends React.ComponentClass<TProps>, React.StatelessComponent<TProps> {
  createInstance(identifier: string): ComponentWithReducer<TProps>
  withExtraState<TParentState, TSubState>(
    mapExtraState: MapState<TParentState, any, TSubState>
  ): ComponentWithReducer<TProps>
  withExtraState<TParentState, TRootState, TSubState>(
    mapExtraState: MapState<TParentState, TRootState, TSubState>
  ): ComponentWithReducer<TProps>
  withOptions(options: Options): ComponentWithReducer<TProps>
}

interface ComponentDecorator {
  <TProps>(component: React.ComponentClass<TProps> | React.StatelessComponent<TProps>): ComponentWithReducer<TProps>
}

export interface ComponentEnhancer {
  <S>(reducer: Reducer<S>, identifier: string, options?: Options): ComponentDecorator
}

export const withReducer: ComponentEnhancer
