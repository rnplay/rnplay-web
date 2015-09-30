'use strict';

const {
  app,
  builds
} = window.__data;

import React from 'react';
import EmbeddedApp from './embedded_components/EmbeddedApp';

React.render(<EmbeddedApp {...window.__data} />, document.getElementById('embedded-container'));
