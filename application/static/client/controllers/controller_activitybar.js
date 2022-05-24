/* eslint-disable */

class controllerActivityBar {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      activityBar: document.getElementById(id),
    };
    this.menu = [{
        text: 'Server',
        icon: 'fas fa-server',
        action: 'server',
      },
      {
        text: 'Client',
        icon: 'fas fa-desktop',
        action: 'client',
      },
      {
        text: 'Database',
        icon: 'fas fa-database',
        action: 'database',
      },
      {
        text: 'External APIs',
        icon: 'fas fa-external-link-alt',
        action: 'external',
      },
      {
        text: 'Files',
        icon: 'far fa-file',
        action: 'files',
      },
      {
        text: 'Mail',
        icon: 'far fa-envelope',
        action: 'mail',
      },
      {
        text: 'Versioning',
        icon: 'fas fa-code-branch',
        action: 'versioning',
      },
      {
        text: 'Test & Debug',
        icon: 'fas fa-bug',
        action: 'debugging',
      },
      {
        text: 'Extensions',
        icon: 'fas fa-th-large',
        action: 'extensions',
      },
      {
        text: 'Templates',
        icon: 'far fa-clone',
        action: 'templates',
      },
      {
        divider: true,
      },
      {
        text: 'Accounts',
        icon: 'far fa-user-circle',
        action: 'accounts',
      },
      {
        text: 'Manage',
        icon: 'fas fa-cog',
        action: 'manage',
        items: [{
            title: 'Command palette...',
            action: 'command_palette',
            shortcut: 'Ctrl+Shift+P',
          },
          {
            type: 'divider',
          },
          {
            title: 'Settings',
            action: 'settings',
            shortcut: 'Ctrl+,',
          },
          {
            title: 'Extensions',
            action: 'extensions',
            shortcut: 'Ctrl+Shift+X',
          },
          {
            type: 'divider',
          },
          {
            title: 'Color Theme',
            action: 'color_theme',
            shortcut: 'Ctrl+K Ctrl+T',
          },
        ],
      },
    ];

    // this.template = `<div class="activity-bar-button" :class="{active:item.action == selectedActivity}" m-for="(item, index) in menu">
    //                 <i class="tooltip-horizontal" :class="item.icon" :data-title="item.text"></i></div>`

    this.elements.activityBar.innerHTML = this.menu
      .map((item) => {
        return item.divider ?
          '<div class="activity-bar-divider"></div>' :
          `<div class="activity-bar-button" data-action="${item.action}"><i class="${item.icon} tooltip-horizontal" data-title="${item.text}"></i>` +
          (item.items ?
            `<div class="menu-item-items">` +
            item.items
            .map((subItem) => {
              return (
                `<div class="menu-item-item">` +
                (subItem.type == 'divider' ?
                  `<div class="menu-item-items-divider"></div>` :
                  `<div class="menu-item-item-title" data-action="${
                              subItem.action
                            }"><div>${subItem.title}</div><div>${
                              subItem.shortcut || ''
                            }</div></div>`) +
                `</div>`
              );
            })
            .join('') +
            `</div>` :
            '') +
          `</div>`;
      })
      .join('');

    this.elements.activityBar
      .querySelectorAll('.menu-item-items')
      .forEach((item) => {
        item.addEventListener('mouseleave', (e) => {
          e.target.classList.remove('active');
        });
      });

    this.elements.activityBar
      .querySelectorAll('.menu-item-item-title')
      .forEach((item) => {
        item.addEventListener('click', (e) => {
          const action =
            e.target.getAttribute('data-action') ||
            e.target.parentElement.getAttribute('data-action');
          this.menuItemClicked(action);
        });
      });

    this.elements.activityBar
      .querySelectorAll('.activity-bar-button')
      .forEach((item, i) => {
        item.addEventListener('click', (e) => {
          const action = e.currentTarget.getAttribute('data-action');
          if (action == 'accounts') {
            console.log('accounts');
          } else if (action == 'manage') {
            // console.log('manage');
            e.currentTarget
              .querySelector('.menu-item-items')
              .classList.toggle('active');
          } else {
            this.selectItem(i);
          }
        });
      });

    this.selectItem(0);
  }

  selectItem(index) {
    this.selectedActivity = this.menu[index].action;
    this.elements.activityBar
      .querySelectorAll('.activity-bar-button')
      .forEach((item, i) => {
        item.classList.toggle('active', i === index);
        if (i === index)
          this.modules.events.emit(
            'activity-bar-item-selected',
            this.menu[i].action
          );
      });
  }

  menuItemClicked(action) {
    console.log(action);
    // this.selectItem(this.menu.findIndex(item => item.action == action));
  }
}

export default controllerActivityBar;
