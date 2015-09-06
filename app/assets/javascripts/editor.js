'use strict';

import React from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

import * as reducers from './reducers/';
import Editor from './containers/Editor';
import { editor } from './actions/';

const reducer = combineReducers(reducers);
const store = applyMiddleware(thunk, promise)(createStore)(reducer)

const {
  app,
  ...rest
} = window.__data;

store.dispatch(editor.switchApp(app));

const { url_params: { file } } = app;
if (file) {
  store.dispatch(editor.switchFile(file));
}

React.render((
  <Provider store={store}>
    {() => (<Editor {...rest} />)}
  </Provider>
), document.getElementById('editor-container'));
