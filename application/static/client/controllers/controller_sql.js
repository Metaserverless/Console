/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerSql {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Sql';
    this.elements = {};

    const value = `SELECT * FROM 'Order';`;

    this.codeEditor = new BaseCodeEditor(id, modules, this.view, {
      mode: 'sql',
      value: ''
    });
  }
}

export default controllerSql;
