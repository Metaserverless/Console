/* eslint-disable */

import css_themes from '../system/css_themes.js';
import Topmenu from '../elements/Topmenu.js';

class controllerTopHeader {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      topMenu: document.getElementById('top-menu'),
      cssThemeLink: document.getElementById('css-theme-link'),
      cssThemeSwitcher: document.getElementById('css-theme-switcher'),
    };

    this.items = [{
        title: 'File',
        items: [{
            title: 'New file',
            action: 'new-file',
            shortcut: 'Ctrl+N',
          },
          {
            title: 'Open file',
            action: 'open-file',
            shortcut: 'Ctrl+O',
          },
          {
            type: 'divider',
          },
          {
            title: 'Save file',
            action: 'save-file',
            shortcut: 'Ctrl+S',
          },
          {
            title: 'Save file as',
            action: 'save-file-as',
            shortcut: 'Ctrl+Shift+S',
          },
          {
            type: 'divider',
          },
          {
            title: 'Export',
            action: 'export',
            shortcut: 'Ctrl+E',
          },
          {
            title: 'Import',
            action: 'import',
            shortcut: 'Ctrl+I',
          },
          {
            type: 'divider',
          },
          {
            title: 'Exit',
            action: 'exit',
            shortcut: 'Ctrl+Q',
          },
        ],
      },
      {
        title: 'Edit',
        items: [{
            title: 'Undo',
            action: 'undo',
            shortcut: 'Ctrl+Z',
          },
          {
            title: 'Redo',
            action: 'redo',
            shortcut: 'Ctrl+Y',
          },
          {
            type: 'divider',
          },
          {
            title: 'Cut',
            action: 'cut',
            shortcut: 'Ctrl+X',
          },
          {
            title: 'Copy',
            action: 'copy',
            shortcut: 'Ctrl+C',
          },
          {
            title: 'Paste',
            action: 'paste',
            shortcut: 'Ctrl+V',
          },
          {
            type: 'divider',
          },
          {
            title: 'Select all',
            action: 'select-all',
            shortcut: 'Ctrl+A',
          },
          {
            title: 'Select none',
            action: 'select-none',
            shortcut: 'Ctrl+Shift+A',
          },
          {
            type: 'divider',
          },
          {
            title: 'Find',
            action: 'find',
            shortcut: 'Ctrl+F',
          },
          {
            title: 'Find next',
            action: 'find-next',
            shortcut: 'F3',
          },
          {
            title: 'Find previous',
            action: 'find-previous',
            shortcut: 'Shift+F3',
          },
          {
            type: 'divider',
          },
          {
            title: 'Replace',
            action: 'replace',
            shortcut: 'Ctrl+H',
          },
          {
            title: 'Replace all',
            action: 'replace-all',
            shortcut: 'Ctrl+Shift+H',
          },
        ],
      },
      {
        title: 'View',
        items: [{
          title: 'Placeholder',
          action: 'placeholder',
          shortcut: 'Ctrl+Shift+P',
        }, ],
      },
      {
        title: 'Run',
        items: [{
          title: 'Placeholder',
          action: 'placeholder',
          shortcut: 'Ctrl+Shift+P',
        }, ],
      },
      {
        title: 'Terminal',
        items: [{
          title: 'New Terminal',
          action: 'new:terminal',
          shortcut: `Ctrl+Shift+'`,
        }, ],
      },
      {
        title: 'Help',
        items: [{
          title: 'Placeholder',
          action: 'placeholder',
          shortcut: 'Ctrl+Shift+P',
        }, ],
      },
    ];

    this.topMenu = new Topmenu('top-menu', modules, this.items);

    let CodeMirrorTheme =
      this.modules.store.get('CodeMirrorTheme') || 'darcula';
    this.elements.cssThemeSwitcher.innerHTML =
      '<option disabled>Select a theme</option>' +
      css_themes.map((t) => `<option value="${t}">${t}</option>`).join('');
    this.elements.cssThemeSwitcher.value = CodeMirrorTheme;
    this.elements.cssThemeSwitcher.addEventListener(
      'change',
      this.switchCssTheme.bind(this)
    );
    this.elements.cssThemeSwitcher.dispatchEvent(new Event('change'));
  }

  switchCssTheme() {
    const theme = this.elements.cssThemeSwitcher.value;
    this.elements.cssThemeLink.href = `https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.3/theme/${theme}.min.css`;
    this.modules.store.set('CodeMirrorTheme', theme);
    this.modules.events.emit('code-mirror:theme:change', theme);
  }

  action(type) {
    this.modules.events.emit(type, {});
  }
}

export default controllerTopHeader;
