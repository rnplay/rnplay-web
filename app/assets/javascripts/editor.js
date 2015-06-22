'use strict';

import React from 'react';
import EditorApp from './components/EditorApp';

React.render(
  <EditorApp {...window.__data}/>,document.getElementById('editor-container')
);
