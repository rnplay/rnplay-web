'use strict';
import axios from 'axios';

export default {

    saveFile(appId, filename, body) {
      return axios.put(`/apps/${appId}/files/${encodeURIComponent(filename)}`, {body});
    },

    toggleAppPickStatus(appId, picked) {
      return axios.put(`/apps/${appId}`, {
        app: {
          pick: +picked
        }
      });
    },

    saveApp(appId, name, buildId, fileBodies) {
      const appUrl = `/apps/${appId}`;
      const filesUrl = `${appUrl}/files/`;

      // store all updates files
      const requests = Object.keys(fileBodies)
        .map((filename) => axios.put(`${filesUrl}${encodeURIComponent(filename)}`, {
          body: fileBodies[filename]
        }));

      // update app info
      requests.push(axios.put(appUrl, {
        app: {
          name: name,
          build_id: buildId
        }
      }));

      return Promise.all(requests);
    },

    forkApp(appToken) {
      return axios.post(`/apps/${appToken}/fork.json`)
      .then(result => result.data);
    }

};
