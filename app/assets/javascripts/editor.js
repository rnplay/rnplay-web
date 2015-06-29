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

redux.dispatch(editor.switchApp(app));

const { url_params: { file } } = app;
if (file) {
  redux.dispatch(editor.switchFile(file));
}

React.render((
  <Provider redux={redux}>
    {() => (<Editor {...rest} />)}
  </Provider>
), document.getElementById('editor-container'));
