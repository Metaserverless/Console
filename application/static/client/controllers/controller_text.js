/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerText {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Text';
    this.elements = {};

    const value = ``;

    this.codeEditor = new BaseCodeEditor(id, modules, this.view, {
      mode: 'text/x-textile',
      value: '',
    });
  }
}

export default controllerText;
