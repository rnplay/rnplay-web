'use strict';

const {
  app,
  ...rest
} = window.__data;

import React from 'react';

import { createStore, combineReducers, applyMiddleware } from 'redux';

import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import promise from './utils/redux/promiseMiddleware';
import createLogger from 'redux-logger';
import * as reducers from './reducers/';
import Editor from './containers/Editor';
import { editor } from './actions/';

let logger = createLogger({
  predicate: (getState, action) => rest.isDevelopment
});

const reducer = combineReducers(reducers);
const store = applyMiddleware(thunk, promise, logger)(createStore)(reducer)

store.dispatch(editor.switchApp(app));

const { url_params: { file } } = app;
if (file) {
  store.dispatch(editor.switchFile(file));
}

// Grande disablos for CodeMirror
window.onscroll = (e) => {
  window.scrollTo(0, 0);
};

React.render((
  <Provider store={store}>
    {() => (<Editor {...rest} />)}
  </Provider>
), document.getElementById('editor-container'));
