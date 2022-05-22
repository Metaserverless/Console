/* eslint-disable */
// import parser from './parser.js';

const store = {
  data: {
    // visualViewport: document.getElementById('diagram'),
    // codeEditorTheme:'darcula'
  },

  init() {},

  set(name, value) {
    this.data[name] = value;
    localStorage.setItem(name, value);
  },
  get(name) {
    if (typeof this.data[name] === 'undefined')
      return localStorage.getItem(name);
    return this.data[name];
  },
};

export default store;
