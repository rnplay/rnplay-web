'use strict';
// import axios from 'axios';
import $ from 'jquery';

export default {

    saveFile(appId, filename, body) {
      return $.ajax({
        url: `/apps/${appId}/files/${encodeURIComponent(filename)}`,
        data: {
          body
        },
        type: 'PUT',
        // hacky way until we fix the server to return json
        // (atleast an emtpy string)
        dataType: 'html'
      });
      // return axios.put(`/apps/${appId}/files/${encodeURIComponent(filename)}`, {body});
    },

    saveApp(appId, name, buildId, fileBodies) {
      const appUrl = `/apps/${appId}`;
      const filesUrl = `${appUrl}/files/`;

      // store all updates files
      const requests = Object.keys(fileBodies)
        .map((filename) => {
          return $.ajax({
            url: filesUrl + encodeURIComponent(filename),
            data: {
              body: fileBodies[filename]
            },
            // hacky way until we fix the server to return json
            // (atleast an emtpy string)
            dataType: 'html',
            type: 'PUT'
          });
        });

      // update app info
      requests.push($.ajax({
        url: appUrl,
        data: {
          app: {
            name,
            buildId
          }
        },
        type: 'PUT'
      }));

      return Promise.all(requests);
    }
};
