import Submenu from "./Submenu.js";

function getItems(acc, fields) {
  const {items} = fields;
  const getGroupSubItems = (item) => {
      if(item.sub_items) {
        acc[item.action] = item.sub_items;
      }
  } 
  items.forEach(getGroupSubItems);
  return acc
};

class Topmenu {
  constructor(id, modules, items) {
    this.id = id;
    this.modules = modules;
    this.items = items;
    this.menu = document.getElementById(id);
    // this.menu.addEventListener('click', this.onClick.bind(this));
    this.sub_menu_items = this.items.reduce((getItems), {})
    console.log(this.sub_menu_items);
    this.call_sub_menu = {
      'export': ($root, fields=['filed1', 'field2', 'field3']) => new Submenu($root, fields),
      'placeholder':($root, fields=['filed1', 'field2', 'field3']) =>  new Submenu($root, fields),
    };
    this.menu.innerHTML = this.items
      .map((item) => {
        return `<div class="menu-item" data-title="${item.title}">
                <div class="menu-item-title">${item.title}</div>
                <div class="menu-item-items">
      ${item.items
        .map((subItem) => {
          return (
            `<div class="menu-item-item ${subItem.sub_menu ? `sub-menu ${subItem.action}` : ''}">` +
            (subItem.type == 'divider'
              ? `<div class="menu-item-items-divider"></div>`
              : `<div class="menu-item-item-title" data-action="${
                  subItem.action
                }"><div>${subItem.title}</div><div>${
                  subItem.shortcut || ''
                }</div></div>`) +
            `</div>`
          );
        })
        .join('')}
      </div>
      </div>`;
      })
      .join('');

    this.menu.querySelectorAll('.menu-item').forEach((item) => {
      item.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      item.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    });
    this.menu.querySelectorAll('.menu-item-items').forEach((item) => {
      item.addEventListener('mouseenter', this.onMouseEnter.bind(this));
      item.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    });
    this.menu.querySelectorAll('.menu-item-item-title').forEach((item) => {
      item.addEventListener('click', this.onItemClick.bind(this));
    });
    this.menu.querySelectorAll('.menu-item-item-title').forEach((item) => {
      item.addEventListener('mouseenter', this.onMouseEnterSubMenu.bind(this));
    });
  }

  onMouseEnterSubMenu(e) {
    const $el = e.currentTarget;
    const action = $el.getAttribute('data-action');
    const controller = this.call_sub_menu[action];
    if(controller) {
      const submenu = controller($el, this.sub_menu_items[action]);
      submenu.send().classList.add('active');
      $el.append(submenu.send());
    }
  }

  onMouseEnter(e) {
    this.menu.querySelectorAll('.menu-item').forEach((item) => {
      item.classList.toggle('active', item == e.currentTarget);
    });

    this.menu.querySelectorAll('.menu-item-items').forEach((item) => {
      item.classList.toggle('active', item == e.currentTarget);
    });
  }

  onMouseLeave(e) {
    this.hideAll();
  }

  hideAll() {
    this.menu.querySelectorAll('.menu-item').forEach((item) => {
      item.classList.toggle('active', false);
    });
    this.menu.querySelectorAll('.menu-item-items').forEach((item) => {
      item.classList.toggle('active', false);
    });
  }

  onItemClick(e) {
    let action =
      e.target.getAttribute('data-action') ||
      e.target.parentElement.getAttribute('data-action');
      this.modules.events.emit(action, {});
      this.hideAll();
      dm.router.goto(href);
  }
}

export default Topmenu;
