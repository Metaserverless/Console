/* eslint-disable */
// import treesManager from '../elements/treesManager.js';

class BaseCodeEditor {
  constructor(id, modules, view, config = {}) {
    const element = document.getElementById(id);

    if (!element) return console.error('element not found');

    this.id = id;
    this.modules = modules;
    this.view = view;
    this.mode = config.mode || 'javascript';
    const theme = this.modules.store.get('CodeMirrorTheme') || 'darcula';
    this.node = null;
    // this.originalSource = '';
    // this.editingSource = '';

    const modes = {
      javascript: {
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Q': function (cm) {
            cm.foldCode(cm.getCursor());
          },
        },
        foldGutter: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
        ],
        lint: {
          options: {
            esversion: 2021
          }
        },
      },
      markdown: {
        highlightFormatting: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Q': function (cm) {
            cm.foldCode(cm.getCursor());
          },
        },
        foldGutter: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
        ],
        lint: true,
      },
      sql: {
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Ctrl-Q': function (cm) {
            cm.foldCode(cm.getCursor());
          },
        },
        foldGutter: true,
        gutters: [
          'CodeMirror-lint-markers',
          'CodeMirror-linenumbers',
          'CodeMirror-foldgutter',
        ],
        lint: true,
      },
      'application/ld+json': {
        matchBrackets: true,
        autoCloseBrackets: true,
      },
      'text/css': {
        extraKeys: {
          'Ctrl-Space': 'autocomplete'
        },
      },
      'text/html': {},
    };

    this.extensionTypes = {
      'js': 'javascript',
      'json': 'application/ld+json',
      'md': 'markdown',
      'sql': 'sql',
      // 'pgsql': 'sql',
      'html': 'text/html',
      'css': 'text/css',
    };

    if (!modes[this.mode]) return console.error('mode not found', this.mode);

    const options = Object.assign({
        value: config.value || ``,
        mode: this.mode,
        theme: theme,
        lineNumbers: true,
        lineWrapping: true,
      },
      modes[this.mode]
    );

    this.editor = window.CodeMirror(element, options);

    this.editor.on('change', this.valueChanged.bind(this));

    this.modules.events.listen(
      'code-mirror:theme:change',
      this.setTheme.bind(this)
    );
    this.modules.events.listen(
      'open:source:file',
      this.openSourceFile.bind(this)
    );
  }

  setValue(text) {
    this.editor.setValue(text);
  }

  valueChanged(cm, change) {

    // console.log(this.node);

    const value = cm.getValue();

    // const filePath = 'changedTreeItems.' + this.node.id;

    // const file = this.modules.store.get(filePath);
    // if (!file) return this.modules.dialogs.error('Unable to find file ' + this.node.id);

    // const editinglPath = filePath + '.source.editing';
    // this.modules.store.set(editinglPath, value);
    this.node.original.source = value;
    this.modules.events.emit('code:editor:change', this.node);
    // this.modules.events.emit('code:editor:change', {
    //   id: this.id,
    //   node: this.node,
    //   change,
    //   value,
    //   original: this.node.original.source.original == this.node.original.source.editing
    // });
  }

  setTheme(theme) {
    this.editor.setOption('theme', theme);
  }


  async openSourceFile(node) {

    // const extension = node.text.split('.').pop();
    // if (this.view != this.modules.router.activeViewName()) return;
    if (this.node && this.node.id == node.id) return;
    if (this.mode != this.extensionTypes[node.original.ext]) return;

    // console.log(file)

    if (typeof node.original.source != 'string') return this.modules.dialogs.error('Can not find source for file "' + node.text + '"');

    this.node = node;
    this.editor.setValue(node.original.source);
    this.editor.refresh();

  }

  saveFile() {

  }
}

export default BaseCodeEditor;
