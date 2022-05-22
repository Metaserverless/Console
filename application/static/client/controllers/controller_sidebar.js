/* eslint-disable */

class controllerSidepanel {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;
    const sidebar = document.getElementById(id);
    this.elements = {
      sidebar,
      sections: sidebar.querySelector('.side-bar-sections'),
    };
    this.selectedSection = null;
    modules.events.listen('transport:initiated', this.loadData.bind(this));
    const sections = [{
        text: 'Server',
        icon: 'fas fa-server',
        type: 'server',
      },
      {
        text: 'Client',
        icon: 'fas fa-desktop',
        type: 'client',
      },
      {
        text: 'Database',
        icon: 'fas fa-database',
        type: 'database',
      },
      {
        text: 'External APIs',
        icon: 'fas fa-external-link-alt',
        type: 'external',
      },
      {
        text: 'Files',
        icon: 'far fa-file',
        type: 'files',
      },
      {
        text: 'Mail',
        icon: 'far fa-envelope',
        type: 'mail',
      },
      {
        text: 'Versioning',
        icon: 'fas fa-code-branch',
        type: 'versioning',
      },
      {
        text: 'Debugging',
        icon: 'fas fa-bug',
        type: 'debugging',
      },
      {
        text: 'Templates',
        icon: 'far fa-clone',
        type: 'templates',
      },
    ];


    // console.log($)
    // $(function () {
    for (let section of sections) {
      let div = document.createElement('div');
      div.id = 'side-bar-' + section.type;
      div.setAttribute('data-section', section.type);
      div.className = 'side-bar-section';
      this.elements.sections.appendChild(div);
    }

    let to = false;
    $('#jstree_search').keyup(() => {
      if (to) {
        clearTimeout(to);
      }
      to = setTimeout(
        function () {
          const v = $('#jstree_search').val();
          this.searchSections(v);
          // $(this.selectedSection).jstree(true).search(v);
        }.bind(this),
        250
      );
    });

    this.modules.events.listen(
      'activity-bar-item-selected',
      this.selectSection.bind(this)
    );
    this.selectSection('server');
  }

  async loadData() {
    const data = await this.modules.transport.send('getTrees', {});
    if (!data) return;
    console.log(data);

    const treedata = {
      core: {
        themes: {
          name: 'default-dark',
        },
        check_callback: (operation, node, node_parent, node_position, more) => {
          // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
          // in case of 'rename_node' node_position is filled with the new node name
          console.log(operation, node, node_parent, node_position, more);
          return operation === 'rename_node' ? true : false;
        },
        data: [],
      },
      types: {
        // server: {
        //   icon: '/client/img/folder_type_server.svg',
        // },
        // client: {
        //   icon: '/client/img/folder_type_client.svg',
        // },
        folder: {
          icon: false,
        },
        flow: {
          icon: '/client/img/file_type_puppet.svg',
        },
        md: {
          icon: '/client/img/file_type_markdown.svg', //"fab fa-markdown"
        },
        sql: {
          icon: '/client/img/file_type_sql.svg',
        },
        pgsql: {
          icon: '/client/img/file_type_pgsql.svg',
        },
        js: {
          icon: '/client/img/file_type_js.svg',
        },
        json: {
          icon: '/client/img/file_type_json.svg',
        },
        html: {
          icon: '/client/img/file_type_html.svg',
        },
        css: {
          icon: '/client/img/file_type_css.svg',
        },
        image: {
          icon: '/client/img/file_type_image.svg',
        },
      },
      plugins: [
        'changed',
        'types',
        'unique',
        'dnd',
        'contextmenu',
        'state',
        'search',
      ], //, "sort" ,   "wholerow"
      state: {
        key: 'jstree'
      }
    };



    this.elements.sections.querySelectorAll('.side-bar-section').forEach(section => {
      const type = section.getAttribute('data-section');
      // console.log(type, data[type]);
      if (data[type]) {
        treedata.core.data = data[type];
        treedata.state.key = type;
        $(section)
          .jstree(treedata)
          .on('changed.jstree', this.selectTreeItem.bind(this));
      }
    })
    // this.data = data;

  }

  initSections() {}

  selectTreeItem(e, data) {
    if (data.action != 'select_node') return;
    const id = data.selected[0],
      parent = data.node.parent,
      parents = data.node.parents;

    //  console.log(data);
    const views = {
      main: 'Main',
      js: 'Javascript',
      md: 'Markdown',
      sql: 'Sql',
      css: 'Css',
      html: 'Html',
      json: 'Json',
      flow: 'Diagram',
      pgsql: 'Table',
    };

    if (views[data.node.type]) this.modules.router.goto(views[data.node.type]);
    else this.modules.router.goto('Main');
  }

  searchSections(str) {
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        $(section).jstree(true).search(str);
      });
  }

  selectSection(type) {
    // console.log(type);
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        if (section.getAttribute('data-section') == type) {
          this.selectedSection = section;
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
  }
}

export default controllerSidepanel;
