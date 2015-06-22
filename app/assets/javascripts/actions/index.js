'use strict';

import { createActions } from '../utils/redux/';
import editorActions from './editor';

export const editor = createActions(editorActions);
