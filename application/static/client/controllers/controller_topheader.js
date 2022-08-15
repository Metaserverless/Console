/* eslint-disable */

import css_themes from '../system/css_themes.js';
import Topmenu from '../elements/Topmenu.js';

class controllerTopHeader {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      topMenu: document.getElementById('top-menu'),
      topLogoImage: document.getElementById('top-logo-image'),
      cssThemeLink: document.getElementById('css-theme-link'),
      cssThemeSwitcher: document.getElementById('css-theme-switcher'),
    };

    this.items = [{
        title: 'File',
        items: [{
            title: 'New file',
            action: 'new-file',
            shortcut: '',
          },
          {
            title: 'New folder',
            action: 'new-folder',
            shortcut: '',
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
            action: 'Ctrl+s',
            shortcut: 'Ctrl+S',
          },
          {
            title: 'Save all',
            action: 'Ctrl+Shift+S',
            shortcut: 'Ctrl+Shift+S',
          },
          {
            type: 'divider',
          },
          {
            title: 'Export',
            // action: 'export',
            // shortcut: 'Ctrl+E',
            items:[
              {
                title: 'Submenu Test 1',
                action: 'Submenu Test 1',
                shortcut: 'Ctrl+E'
              },
              {
                type: 'divider',
              },
              {
                title: 'Submenu Test 2',
                action: 'Submenu Test 2',
                shortcut: 'Ctrl+E'
              }
            ]
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
    this.elements.topLogoImage.addEventListener(
      'click',
      () => {
        // console.log('top-logo-click');
        this.modules.events.emit('ide-top-logo-click', {});
      },
    )

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

    this.modules.events.listen('Ctrl+l', ()=>this.toggleLineNumbers(true));
    const storedFromLastSession  = this.modules.store.get('displayLineNumbers', true);
    if (storedFromLastSession === false) this.toggleLineNumbers(false);
    else this.modules.store.set('displayLineNumbers', true, true);

    this.displayTop = true;
    this.displayLeft = true;
    this.fullScren = true;

    this.modules.events.listen('Ctrl+y', () =>
      this.openInFullScreen('top', this.displayTop),
    );
    this.modules.events.listen('Ctrl+e', () =>
      this.openInFullScreen('left', this.displayLeft),
    );
    this.modules.events.listen('Ctrl+Shift+E', () =>
      this.openInFullScreen('top+left', this.fullScren),
    );
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

  toggleLineNumbers(storeChanges) {
    this.modules.events.emit('toggleLineNumbers');
    if (storeChanges) {
      const storedFromLastSession  = this.modules.store.get('displayLineNumbers', true);
      this.modules.store.set('displayLineNumbers', !storedFromLastSession, true);
    }
  }

  openInFullScreen(type, state) {
    switch (type) {
      case 'top':
        this.modules.events.emit('setTop', !state);
        return (this.displayTop = !this.displayTop);
      case 'left':
        this.modules.events.emit('setLeft', !state);
        return (this.displayLeft = !this.displayLeft);
      default:
        this.modules.events.emit('setTopAndLeft', !state);
        return (
          (this.displayTop = !state),
          (this.displayLeft = !state),
          (this.fullScren = !state)
        );
    }
  }
}

export default controllerTopHeader;
