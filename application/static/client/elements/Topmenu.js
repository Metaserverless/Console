class Topmenu {
  constructor(id, modules, items) {
    this.id = id;
    this.modules = modules;
    this.items = items;
    this.menu = document.getElementById(id);
    // this.menu.addEventListener('click', this.onClick.bind(this));

    this.menu.innerHTML = this.items
      .map((item) => {
        return `<div class="menu-item" data-title="${item.title}">
        <div class="menu-item-title">${item.title}</div>
        ${item.items ? Topmenu.generateItemsHtml(item.items, 1) : ''}
      </div>`;
      })
      .join('');

    this.menu
      .querySelectorAll(
        '.menu-item, .menu-items-list-1, .menu-items-list-button, .menu-items-list-2',
      )
      .forEach((item) => {
        item.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        item.addEventListener('mouseleave', this.onMouseLeave.bind(this));
      });
    this.menu.querySelectorAll('.menu-items-list-button').forEach((item) => {
      item.addEventListener('click', this.onItemClick.bind(this));
    });
  }


  onMouseEnter(e) {
    e.currentTarget.classList.toggle('active', true);
  }
  onMouseLeave(e) {
    e.currentTarget.classList.toggle('active', false);
    // this.hideAll();
  }

  hideAll() {
    this.menu
      .querySelectorAll(
        '.menu-item,.menu-items-list-1, .menu-items-list-button, .menu-items-list-2',
      )
      .forEach((item) => {
        item.classList.toggle('active', false);
    });
  }

  onItemClick(e) {
    e.stopPropagation();
    const action =
      e.target.getAttribute('data-action') ||
      e.target.parentElement.getAttribute('data-action');
      console.log(action);
    if (action) this.modules.events.emit(action, {});
    this.hideAll();
    // dm.router.goto(href);
  }
}

Topmenu.generateItemsHtml = (items, step = 1) => {
  let res =  `<div class="menu-items-list-${step}">`;
  res += items
    .map((item) => {
      return (
        `<div class="menu-items-list-item">` +
        (item.type == 'divider'
          ? `<div class="menu-items-list-divider"></div>`
          : `<div class="menu-items-list-button" data-action="${item.action}">
              <div>${item.title}</div>
              <div>${item.shortcut || ''}</div>` +
                (item.items
                  ? '>' + Topmenu.generateItemsHtml(item.items, step + 1)
                  : ``) +
            `</div>`) +
        `</div>`
      );
    })
    .join('');
    res += `</div>`;
    return res;
}


export default Topmenu;
