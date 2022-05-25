/* eslint-disable */

class BaseCodeEditor {
  constructor(id, modules, view, config = {}) {
    const element = document.getElementById(id);

    if (!element) return console.error('element not found');

    this.id = id;
    this.modules = modules;
    this.view = view;
    this.mode = config.mode || 'javascript';
    const theme = this.modules.store.get('CodeMirrorTheme') || 'darcula';
    this.file = null;

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
      this.openFile.bind(this)
    );
  }

  setValue(text) {
    this.editor.setValue(text);
  }

  valueChanged(cm, change) {

    // console.log(this.file);

    const value = cm.getValue();

    const originalPath = this.storePath(this.file, true);
    const editingPath = this.storePath(this.file, false)
    const originalSource = this.modules.store.get(originalPath);
    this.modules.store.set(editingPath, value)

    this.modules.events.emit('code:editor:change', {
      id: this.id,
      file: this.file,
      change,
      value,
      original: originalSource == value
    });
  }

  setTheme(theme) {
    this.editor.setOption('theme', theme);
  }

  storePath(file, original = true) {
    return `codeEditor.${original ? 'original' : 'editing'}.${file.type}.${file.path}`;
  }

  async openFile(file) {
    const extension = file.name.split('.').pop();
    if (this.view != this.modules.router.activeViewName()) return;
    if (this.mode != this.extensionTypes[extension]) return;
    if (this.file && this.file.name == file.name && this.file.path == file.path) {
      return;
    }
    const originalPath = this.storePath(file, true);
    const editingPath = this.storePath(file, false);

    let source = this.modules.store.get(editingPath);
    // console.log(file.type, file.path, source);

    if (!source) {
      const data = await this.modules.transport.send('getTenantFile', {
        type: file.type,
        path: file.path
      });
      if (typeof data.source === 'string') {
        source = data.source;
        this.modules.store.set(originalPath, source)
        this.modules.store.set(editingPath, source)
      }
    }
    if (typeof source != 'string') return console.error('source not found', file.type, file.path, typeof source);



    // this.modules.store.set()
    this.file = {
      ...file
    };
    this.editor.setValue(source);
    this.editor.refresh();
    this.modules.events.emit('source:file:opened', file);

  }

  saveFile() {

  }
}

export default BaseCodeEditor;
