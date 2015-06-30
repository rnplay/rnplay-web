'use strict';

import { createActions } from '../utils/redux/';
import editorActions from './editor';
import logActions from './logger';

export const editor = createActions(editorActions);
export const logger = createActions(logActions);
