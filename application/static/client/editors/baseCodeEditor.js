/* eslint-disable */

class BaseCodeEditor {
  constructor(id, modules, config = {}) {
    const element = document.getElementById(id);

    if (!element) return console.error('element not found');

    this.id = id;
    this.modules = modules;

    const mode = config.mode || 'javascript';
    const theme = this.modules.store.get('CodeMirrorTheme') || 'darcula';

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
        lint: { options: { esversion: 2021 } },
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
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
      },
      'text/html': {},
    };

    if (!modes[mode]) return console.error('mode not found');

    const options = Object.assign(
      {
        value: config.value || ``,
        mode: mode,
        theme: theme,
        lineNumbers: true,
        lineWrapping: true,
      },
      modes[mode]
    );

    this.editor = window.CodeMirror(element, options);

    this.editor.on('change', this.valueChanged.bind(this));

    this.modules.events.listen(
      'code-mirror:theme:change',
      this.setTheme.bind(this)
    );
  }

  setValue(text) {
    this.editor.setValue(text);
  }

  valueChanged(cm, change) {
    console.log(change);
    this.modules.events.emit(this.id + ':input:change', {
      change,
      value: cm.getValue(),
    });
  }

  setTheme(theme) {
    this.editor.setOption('theme', theme);
  }
}

export default BaseCodeEditor;
