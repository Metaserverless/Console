/* eslint-disable */

class FlowMarkdownEditor {
  constructor(id, modules, config = {}) {
    const element = document.getElementById(id);

    if (!element) return console.error('element not found');

    this.id = id;
    this.modules = modules;
    const theme = this.modules.store.get('CodeMirrorTheme') || 'darcula';

    const options = {
      value: ``,
      mode: 'markdown',
      theme: theme,
      lineNumbers: true,
      lineWrapping: true,
      highlightFormatting: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
      },
      gutters: ['CodeMirror-lint-markers'],
      lint: true,
    };

    this.markdownCodeMirror = window.CodeMirror(element, options);

    this.markdownCodeMirror.on('change', this.valueChanged.bind(this));

    this.modules.events.listen(
      'code-mirror:theme:change',
      this.setTheme.bind(this)
    );
  }

  setValue(text) {
    this.markdownCodeMirror.setValue(text);
    // this.markdownCodeMirror.refresh()
  }

  valueChanged(cm, change) {
    //  console.log(cm.getValue(), change);
    this.modules.events.emit(this.id + ':input:change', {
      change,
      value: cm.getValue(),
    });
  }

  setTheme(theme) {
    this.markdownCodeMirror.setOption('theme', theme);
  }
}

export default FlowMarkdownEditor;
