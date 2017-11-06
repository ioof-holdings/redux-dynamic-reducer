/**
 * Copyright 2017, IOOF Holdings Limited.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { Reducer, Store, StoreEnhancer } from 'redux';

export interface StoreCreator {
  <S>(): Store<S>;
  <S>(reducer: Reducer<S>): Store<S>;
  <S>(reducer: Reducer<S>, enhancer: StoreEnhancer<S>): Store<S>;
  <S>(reducer: Reducer<S>, preloadedState: S): Store<S>;
  <S>(reducer: Reducer<S>, preloadedState: S, enhancer: StoreEnhancer<S>): Store<S>;
}

export const createStore: StoreCreator;

declare module "redux" {

  export interface NestableReducersMapObject {
    [key: string]: (NestableReducersMapObject | Reducer<any>);
  }

  export interface Store<S> {
    attachReducers(reducers: NestableReducersMapObject): void;
  }
}
