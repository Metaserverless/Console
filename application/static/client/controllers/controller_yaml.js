/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerYaml {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Yaml';
    this.elements = {};

    const value = ``;

    this.codeEditor = new BaseCodeEditor(id, modules, this.view, {
      mode: 'text/x-yaml',
      value: '',
    });
  }
}

export default controllerYaml;
