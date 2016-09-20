'use strict';

import { createStore, getActionIds } from '../utils/redux/';
import { logger } from '../actions/';

const actions = getActionIds(logger);
const initialState = {
  logs: [],
};

export default createStore(initialState, {

  [`${actions.log}`]: (state,  { item }) => {
    console.log(item);

    return {
      logs: [],
    };

    return {
      logs: state.logs.concat(item)
    };
  }

});
