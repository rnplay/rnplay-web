'use strict';

import api from '../utils/api';

let id = 0;

export default {

  log: (item) => {
    if (item) {
      const { msgType = 'lifecycle' } = item;
      const { message = item } = item;

      return {
        item: {
          id: ++id,
          message,
          msgType,
          timestamp: new Date()
        }
      };
    }
  },

};
