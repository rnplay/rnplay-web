'use strict';

import React from 'react';
import { createRedux, createDispatcher, composeStores} from 'redux';
import { Provider } from 'redux/react';
import thunkMiddleware from 'redux/lib/middleware/thunk';

import promiseMiddleware from './utils/redux/promiseMiddleware';
import * as stores from './stores/';
import Editor from './containers/Editor';
import { editor } from './actions/';

const redux = createRedux(createDispatcher(
  composeStores(stores),
  getState => [promiseMiddleware, thunkMiddleware(getState)]
));

const {
  app,
  ...rest
} = window.__data;

let { urlToken, url_params: { file } } = app;

redux.dispatch(editor.switchApp(app));
redux.dispatch(editor.getFiles(urlToken));

if (file) {
  redux.dispatch(editor.switchFile(file));
}

file = file ? file : redux.getState().editor.currentFile;
redux.dispatch(editor.getFile(urlToken, file));

React.render((
  <Provider redux={redux}>
    {() => (<Editor {...rest} />)}
  </Provider>
), document.getElementById('editor-container'));
