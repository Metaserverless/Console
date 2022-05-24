/* eslint-disable */

import events from './events.js';
import tempData from './temp_data.js';
// console.log(tempData);

const transport = {
  endpoint: null,

  init(api) {
    this.endpoint = window.api;
    if (!api || !api.console)
      return console.error('Console APIs are not available');

    api.console.on('error', (error) => {
      events.emit('console:error', error);
    });

    window.api.console.on('step', (step) => {
      events.emit('console:step', step);
    });

    window.api.console.on('notify', (notify) => {
      events.emit('console:notify', notify);
    });

    window.api.console.on('invoke', (invoke) => {
      events.emit('console:notify', invoke);
    });

    window.api.console.on('form', (step) => {
      events.emit('console:form', step);
    });

    events.emit('transport:initiated', {});
    // window.api.console.on('step', (step) => {
    //   events.emit('step', step);
    // });
  },

  async send(method, data, apiType = 'console') {
    if (!this.endpoint) return console.error('no endpoint');

    const type = apiType;
    // console.log(tempData[method])
    if (tempData[method]) return tempData[method](data);
    // console.log(tempData);

    if (!this.endpoint[type] || !this.endpoint[type][method])
      return console.error('no endpoint method', type, method);
    try {
      const res = await this.endpoint[type][method](data);
      return res;
    } catch (e) {
      console.error(e);
    }
  },

  listen(name, callback) {},

  remove(name, callback) {
    // document.removeEventListener(name, callback);
  },
};

export default transport;
