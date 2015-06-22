'use strict';

import zipObject from 'lodash/array/zipObject';
import mapValues from 'lodash/object/mapValues';
import map from 'lodash/collection/map';
import uniqueId from 'uniqueid';

// Create actions that don't need constants :)
export const createActions = (actionObj) => {
  const baseId = uniqueId();
  return zipObject(map(actionObj, (actionCreator, key) => {
    const actionId = `${baseId}-${key}`;
    const method = (...args) => {
      const result = actionCreator(...args);
      return {
        type: actionId,
        ...(result || {})
      };
    };
    method._id = actionId;
    return [key, method];
  }));
};

// Get action ids from actions created with `createActions`
export const getActionIds = (actionCreators) => {
  return mapValues(actionCreators, (value, key) => {
    return value._id;
  });
};

// Replace switch statements in stores (taken from the Redux README)
export const createStore = (initialState, handlers) => {
  return (state = initialState, action) =>
    handlers[action.type] ?
      handlers[action.type](state, action) :
      state;
};
