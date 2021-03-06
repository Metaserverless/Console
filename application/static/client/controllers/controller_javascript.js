/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerJavascript {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Javascript';
    this.elements = {};

    const value = `/*
* Demonstration of code folding
*/
function myScript(){
  return 100;
}
\n`;

    this.codeEditor = new BaseCodeEditor(id, modules, this.view, {
      mode: 'javascript',
      value: '',
    });
  }
}

export default controllerJavascript;
