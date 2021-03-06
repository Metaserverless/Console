/* eslint-disable */
import BaseCodeEditor from '../editors/baseCodeEditor.js';

class controllerMarkdown {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.view = 'Markdown';
    this.elements = {};

    const value = `# Foo
    ## Bar

    blah blah

    ## Baz

    blah blah

    # Quux

    blah blah`;

    this.codeEditor = new BaseCodeEditor(id, modules, this.view, {
      mode: 'markdown',
      value: '',
    });
  }
}

export default controllerMarkdown;
