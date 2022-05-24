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
    modules.events.listen('code:editor:change', this.treeItemSourceChanged.bind(this));
    modules.events.listen('source:file:saved', this.sourceFileSaved.bind(this));

    this.fileTypes = {
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'svg': 'image',
      'ico': 'image',
      'gif': 'image'
    }

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
        text: 'Extensions',
        icon: 'fas fa-th-large',
        action: 'extensions',
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
    const data = await this.modules.transport.send('getTenantStructure', {});
    if (!data) return;
    // console.log(data);

    const trees = {
      server: [],
      client: [],
      database: [],
      external: [],
      files: [],
      mail: [],
      versioning: [],
      debugging: [],
      templates: [],
    }


    const server = ['apis', 'flows', 'schemas', 'store'].map(folderName => {
      return {
        name: folderName,
        children: data[folderName].map(name => {
          return {
            name,
            // type: name.split('.').pop(),
          }
        })
      }
    });
    trees.server = this.traverseFolders(server, 'server', true);
    trees.client = this.traverseFolders(data.client, 'client', true);
    trees.database = this.traverseFolders([{
      name: 'Postgres',
      children: [{
        name: 'Order',
        type: 'pgsql'
      }]
    }, {
      name: 'Redis',
      children: [{
        name: 'Order Cache',
        type: 'redis'
      }]
    }]);



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
        // flow: {
        //   icon: '/client/img/file_type_puppet.svg',
        // },
        md: {
          icon: '/client/img/file_type_markdown.svg', //"fab fa-markdown"
        },
        sql: {
          icon: '/client/img/file_type_sql.svg',
        },
        pgsql: {
          icon: '/client/img/file_type_pgsql.svg',
        },
        redis: {
          icon: '/client/img/file_type_redis.webp'
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
        key: 'jstree',
      },
      contextmenu: {
        select_node: false
      }
    };

    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        const type = section.getAttribute('data-section');
        // console.log(type, data[type]);
        if (trees[type]) {
          treedata.core.data = trees[type];
          treedata.state.key = type;
          $(section)
            .jstree(treedata)
            .on('changed.jstree', this.selectTreeItem.bind(this))
            .on('show_contextmenu.jstree', this.showContextMenu.bind(this));
        }
      });
    // this.data = data;
  }

  traverseFolders(items, location = 'client', system = false) {
    const result = [];
    for (let item of items) {
      // console.log(folder.id);
      if (item.children) {
        const folder = {
          id: item.name,
          type: 'folder',
          location,
          system: system,
          text: item.name,
          children: this.traverseFolders(item.children, location, system)
        };
        result.push(folder);
      } else {
        const ext = item.name.split('.').pop();
        const type = item.type || this.fileTypes[ext] || ext;
        const file = {
          id: item.name,
          location,
          // folder: folderName,
          type: type,
          system: system,
          text: item.name,
        };
        result.push(file);
      }
    }
    result.sort(this.sortFolder)
    return result;

  }

  sortFolder(a, b) {
    if (a.type === 'folder' && b.type !== 'folder') {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return -1;
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
      // flow: 'Diagram',
      pgsql: 'Table',
    };

    let view = 'Main';
    if (data.node.parent == 'flows') {
      view = 'Diagram';
    } else if (views[data.node.type]) {
      view = views[data.node.type];
    }

    this.modules.events.emit('tree-item-selected', data.node);
    // console.log(data)
    if (data.node.type != 'folder' && data.node.original.location) {

      let file;

      if (data.node.original.location == 'server') {
        const nodeTypes = {
          'apis': 'api',
          'flows': 'flow',
          'schemas': 'schema',
          'store': 'store'
        };
        file = {
          id: data.node.id,
          name: data.node.text,
          type: nodeTypes[data.node.parent],
          path: data.node.text
        }
      } else {
        file = {
          id: data.node.id,
          name: data.node.text,
          type: 'client',
          path: data.node.parents.filter(p => p != '#').reverse().join('/') + '/' + data.node.text
        }
      }
      this.modules.events.emit('open:source:file', file);
    }
    this.modules.router.goto(view);
  }

  treeItemSourceChanged(data) {
    // console.log(data);
    const treeItem = document.getElementById(data.file.id);
    if (!treeItem) return console.log('treeItem not found', data.file.id);
    if (data.original) {
      treeItem.classList.remove('changed');
      // console.log('same value')

    } else {
      treeItem.classList.add('changed');
      // console.log('different value')
    }
  }
  sourceFileSaved(file) {
    const treeItem = document.getElementById(file.id);
    if (!treeItem) return console.log('treeItem not found', file.id);
    treeItem.classList.remove('changed');
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

  showContextMenu(event, data) {
    // console.log(event);
    // console.log(data);
  }
}

export default controllerSidepanel;
