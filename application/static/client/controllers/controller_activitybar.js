/* eslint-disable */

class controllerActivityBar {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    this.elements = {
      activityBar: document.getElementById(id),
    };
    this.currentSection = 'server';
    this.menu = [{
        text: 'Server',
        icon: 'fas fa-server',
        section: 'server',
      },
      {
        text: 'Client',
        icon: 'fas fa-desktop',
        section: 'client',
      },
      {
        text: 'Database',
        icon: 'fas fa-database',
        section: 'database',
      },
      {
        text: 'External APIs',
        icon: 'fas fa-external-link-alt',
        section: 'external',
      },
      {
        text: 'Files',
        icon: 'far fa-file',
        section: 'files',
      },
      {
        text: 'Mail',
        icon: 'far fa-envelope',
        section: 'mail',
      },
      {
        text: 'Versioning',
        icon: 'fas fa-code-branch',
        section: 'versioning',
      },
      {
        text: 'Test & Debug',
        icon: 'fas fa-bug',
        section: 'debugging',
      },
      {
        text: 'Extensions',
        icon: 'fas fa-th-large',
        section: 'extensions',
      },
      {
        text: 'Templates',
        icon: 'far fa-clone',
        section: 'templates',
      },
      {
        divider: true,
      },
      {
        text: 'Accounts',
        icon: 'far fa-user-circle',
        section: 'accounts',
      },
      {
        text: 'Manage',
        icon: 'fas fa-cog',
        section: 'manage',
        items: [{
            title: 'Command palette...',
            section: 'command_palette',
            shortcut: 'Ctrl+Shift+P',
          },
          {
            type: 'divider',
          },
          {
            title: 'Settings',
            section: 'settings',
            shortcut: 'Ctrl+,',
          },
          {
            title: 'Extensions',
            section: 'extensions',
            shortcut: 'Ctrl+Shift+X',
          },
          {
            type: 'divider',
          },
          {
            title: 'Color Theme',
            section: 'color_theme',
            shortcut: 'Ctrl+K Ctrl+T',
          },
        ],
      },
    ];

    // this.template = `<div class="activity-bar-button" :class="{active:item.section == selectedActivity}" m-for="(item, index) in menu">
    //                 <i class="tooltip-horizontal" :class="item.icon" :data-title="item.text"></i></div>`

    this.elements.activityBar.innerHTML = this.menu
      .map((item) => {
        return item.divider ?
          '<div class="activity-bar-divider"></div>' :
          `<div class="activity-bar-button" data-section="${item.section}"><i class="${item.icon} tooltip-horizontal" data-title="${item.text}"></i>` +
          (item.items ?
            `<div class="menu-item-items">` +
            item.items
            .map((subItem) => {
              return (
                `<div class="menu-item-item">` +
                (subItem.type == 'divider' ?
                  `<div class="menu-item-items-divider"></div>` :
                  `<div class="menu-item-item-title" data-section="${
                              subItem.section
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
          const section =
            e.target.getAttribute('data-section') ||
            e.target.parentElement.getAttribute('data-section');
          this.menuItemClicked(section);
        });
      });

    this.elements.activityBar
      .querySelectorAll('.activity-bar-button')
      .forEach((item, i) => {
        item.addEventListener('click', (e) => {
          const section = e.currentTarget.getAttribute('data-section');
          if (section == 'accounts') {
            console.log('accounts');
          } else if (section == 'manage') {
            // console.log('manage');
            e.currentTarget
              .querySelector('.menu-item-items')
              .classList.toggle('active');
          } else {
            this.selectItem(i);
          }
        });
      });

    this.modules.events.listen('select:activity:item', this.selectItemBySection.bind(this));


    this.selectItem(0);


  }

  selectItem(index) {
    this.selectedActivity = this.menu[index].section;
    this.elements.activityBar
      .querySelectorAll('.activity-bar-button')
      .forEach((item, i) => {
        item.classList.toggle('active', i === index);
        if (i === index) {
          this.modules.events.emit(
            'activity-bar-item-selected',
            this.menu[i].section
          );
          this.currentSection = this.menu[i].section;
        }
      });
  }

  selectItemBySection(section) {
    for (let i = 0; i < this.menu.length; i++) {
      if (this.menu[i].section == section) {
        this.selectItem(i);
        break;
      }
    }
  }

  menuItemClicked(section) {
    console.log(section);
    // this.selectItem(this.menu.findIndex(item => item.section == section));
  }
}

export default controllerActivityBar;
