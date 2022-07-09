/* eslint-disable */
import tree_config from './tree_config.js';
import Tree from './Tree.js';

const treesManager = {

  currentTree: null,
  currentTreeNode: null,
  changedTreeItems: [],
  trees: {},
  treesReady: false,
  lastOperation: null,
  timeout: null,
  folders: {
    apis: {
      ext: ['js']
    },
    flows: {
      ext: ['md']
    },
    schemas: {
      ext: ['js']
    },
    store: {
      ext: ['js']
    },
    client: {
      ext: ['js', 'css', 'html', 'json', 'md']
    }
  },
  fileTypes: {
    'png': 'image',
    'jpg': 'image',
    'jpeg': 'image',
    'svg': 'image',
    'ico': 'image',
    'gif': 'image'
  },
  permissions: {
    server: {
      root: [],
      folder: [],
      file: ['create', 'delete', 'rename'],
      // custom:{}
    },
    client: {
      root: ['create', 'delete', 'rename', 'move', 'copy', 'cut', 'paste'],
      folder: ['create', 'delete', 'rename', 'move', 'copy', 'cut', 'paste'],
      file: ['create', 'delete', 'rename', 'move', 'copy', 'cut', 'paste']
    },
    database: {
      root: [],
      folder: [],
      file: ['create', 'delete', 'rename'],
      // custom:{}
    },
  },

  init(modules) {
    this.modules = modules;
    // this.modules.events.listen('sidebar:current:tree', (tree) => console.log(tree))

    modules.events.listen('tree-is-ready', this.checkReadiness.bind(this));
    modules.events.listen('sidebar:section:selected', this.selectTree.bind(this));
    modules.events.listen('tree-item-selected', this.selectTreeNode.bind(this));
    modules.events.listen('code:editor:change', this.setTreeNodeElementChanged.bind(this));
    // modules.events.listen('source:file:saved', this.sourceFileSaved.bind(this));

    modules.events.listen('new-file', () => this.newTreeItem());
    modules.events.listen('new-folder', () => this.newTreeItem(true));

    modules.events.listen('new-node-created', this.saveAndCheckTreeItem.bind(this));
    modules.events.listen('new-node-from-copy', this.saveAndCheckTreeItem.bind(this));
    modules.events.listen('node-moved', this.saveAndCheckTreeItem.bind(this));

    modules.events.listen('Ctrl+s', this.saveFile.bind(this));
    modules.events.listen('Ctrl+Shift+S', this.saveAllChanges.bind(this));



  },

  checkReadiness(type) {
    for (let id in this.trees) {
      if (!this.trees[id].ready) return;
    }
    this.treesReady = true;
    this.modules.events.emit('system-is-ready');
    if (this.currentTreeNode) this.modules.events.emit('select:activity:item', this.currentTreeNode.original.section);
  },

  async makeTrees(sections, selectedSectionType) {

    const data = await this.modules.transport.send('getTenantStructure', {});
    if (!data) return console.error('no data from server');
    const treesData = this.processServerData(data);


    for (let section of sections) {
      // console.log(section.type)
      if (!treesData[section.type]) continue;

      const treeconfig = tree_config(this, section, treesData[section.type]);

      this.trees[section.type] = new Tree(section.el, section.type, treeconfig, this.modules);
      if (selectedSectionType == section.type) {
        this.currentTree = this.trees[section.type];
        // for()
        // this.trees[section.type].active = true;
      }
    }

  },

  processServerData(data) {

    const trees = {};


    const server = [{
      name: 'apis',
      filesType: 'rpc',
      filesExt: 'js'
    }, {
      name: 'flows',
      filesType: 'process',
      filesExt: 'md',
    }, {
      name: 'schemas',
      filesType: 'schema',
      filesExt: 'js'
    }, {
      name: 'store',
      filesType: 'procedure',
      filesExt: 'js'
    }].map(folder => {
      return {
        name: folder.name,
        type: 'folder',
        ext: folder.filesExt,

        children: data[folder.name].map(name => {
          return {
            name,
            type: folder.filesType,
            ext: folder.filesExt,

            // folder: folder.name,
            // type: name.split('.').pop(),
          }
        })
      }
    });

    const database = [{
      name: 'Postgres',
      type: 'folder',
      fileType: 'postgres',
      ext: 'md',
      children: [{
        name: 'Order.md',
        // folder: 'Postgres',
        type: 'postgres',
        ext: 'md'
      }]
    }, {
      name: 'Redis',
      type: 'folder',
      fileType: 'redis',
      ext: 'js',
      children: [{
        name: 'Order.js',
        // folder: 'Redis',
        type: 'redis',
        ext: 'js'
      }]
    }];


    trees.server = this.traverseFolders(server, 'server', false);
    trees.client = this.traverseFolders(data.client, 'client', false);
    trees.database = this.traverseFolders(database, 'database', false);

    return trees;

  },

  traverseFolders(items, section) {
    const result = [];
    let ext, type, permissions, folder, file;
    for (let item of items) {
      // console.log(folder.id);

      if (item.children) {
        ext = item.ext || '';
        type = item.fileType || this.fileTypes[ext] || ext;
        permissions = this.permissions[section] && this.permissions[section].folder ? this.permissions[section].folder : null;
        folder = this.makeFolder(item.name, ext, section, permissions, type, this.traverseFolders(item.children, section));
        result.push(folder);
      } else {
        ext = item.name.split('.').pop();
        type = item.type || this.fileTypes[ext] || ext;
        permissions = this.permissions[section] && this.permissions[section].file ? this.permissions[section].file : null;
        file = this.makeFile(item.name, ext, section, permissions, type);
        result.push(file);
      }
    }
    result.sort(this.sortFolder)
    return result;

  },

  sortFolder(a, b) {
    if (a.type === 'folder' && b.type !== 'folder') {
      return -1;
    }
    if (a.text > b.text) {
      return 1;
    }
    return -1;
  },

  makeFolder(text, ext, section, permissions, fileType, children = [], newItem = false) {
    return {
      text,
      ext,
      section,
      permissions,
      type: 'folder',
      fileType,
      children,
      new: newItem
    }
  },

  makeFile(text, ext, section, permissions, fileType, newItem = false) {
    return {
      text,
      ext,
      // folder: folderName,
      section,
      permissions,
      type: fileType,
      source: '',
      loaded: false,
      new: newItem
    }
  },

  setStoredFile(node, source, rewrite) {
    const storeId = 'changedTreeNodes' + '.' + node.id;
    const storedFile = this.modules.store.get(storeId);
    if (storedFile && typeof source != 'string' && !rewrite) return;
    // if (storedFile && !rewrite) return;

    let file, path = node.original.path;
    if (!path) {
      path = this.trees[node.original.section].getNodePath(node);
      node.original.path = path;
    }

    file = {
      id: node.id,
      ...node.original
    };

    if (storedFile && !rewrite) {
      file = storedFile;
    }

    if (node.type != 'folder' && typeof source == 'string') file.source = source;
    this.modules.store.set(storeId, file);
  },

  getStoredFile(node) {
    const storePath = 'changedTreeNodes' + '.' + node.id;
    return this.modules.store.get(storePath);
  },

  deleteStoredFile(id) {
    const storePath = 'changedTreeNodes' + '.' + id;
    return this.modules.store.delete(storePath);
  },

  selectTree(type) {

    this.currentTree = this.trees[type] || null;
    this.currentTreeNode = null;
    if (!this.currentTree) return;

    const treeInstance = this.currentTree.instance;
    const selectedFiles = treeInstance.get_selected(true);

    if (this.treesReady && selectedFiles.length) {
      // console.log('selectTree', type)
      const node = selectedFiles[0];
      this.currentTree.selectTreeItem(null, {
        action: 'select_node',
        node
      })
    }
  },

  async selectTreeNode(node) {

    // console.log('selectTreeNode', item)
    let view = 'Main';



    const views = {
      folder: 'Main',
      schema: 'Javascript',
      rpc: 'Javascript',
      procedure: 'Javascript',
      process: 'Diagram',
      main: 'Main',
      js: 'Javascript',
      md: 'Markdown',
      sql: 'Sql',
      css: 'Css',
      html: 'Html',
      json: 'Json',
      postgres: 'Table',
      redis: 'Main',
    };

    this.currentTreeNode = node;

    if (node) {
      this.setStoredFile(node);
      view = views[node.type] || 'Main';
      if (node.type != 'folder' && ['server', 'client'].includes(node.original.section)) {
        this.openSourceFile(node);
      }
    }
    this.modules.router.goto(view);
  },

  async openSourceFile(node) {

    // const changedFilePath = `changedTreeItems.${item.id}`;
    // const changedFile = this.modules.store.get(changedFilePath);



    if (!node.original.new && !node.original.loaded) {

      const storedFile = this.getStoredFile(node);
      const path = storedFile ? storedFile.path : node.original.path;

      const args = {
        section: node.original.section,
        type: node.original.section == 'server' ? node.type : node.original.section,
        path: node.original.section == 'server' ? node.text : path
      };

      console.log(args)

      const data = await this.modules.transport.send('readTenantFile', args);

      if (typeof data.source == 'string') {
        node.original.source = data.source;
        this.setStoredFile(node, data.source);
        node.original.loaded = true;
      } else {
        return this.modules.dialogs.error('Can not find file "' + node.text + '"');
      }

      // console.log(this.currentTreeNode.name, this.currentTreeNode.source);
      // this.modules.store.set(changedFilePath, item);
    }
    // console.log(this.currentTreeNode, this.currentTreeNode.source);
    this.currentTreeNode = node;
    if (this.treesReady) this.modules.events.emit('open:source:file', node);

  },

  saveAndCheckTreeItem(node) {
    this.setStoredFile(node);
    setTimeout(() => this.setTreeNodeElementChanged(node), 0);
  },

  setTreeNodeElementChanged(node) {

    // console.log(node.id)


    const storedFile = this.getStoredFile(node);
    if (!storedFile) return console.error('treeItem not found', node.text);

    let different = false;

    if (node.original.new) different = true;
    else if (storedFile.text != node.text) different = true;
    else if (storedFile.path != node.original.path) different = true;
    else if (node.type != 'folder' && storedFile.source != node.original.source) different = true;

    node.li_attr.changed = different ? true : false;

    // console.log(node.original.section, different, storedFile.text, node.original.text)

    if (this.trees[node.original.section]) this.trees[node.original.section].instance.redraw_node(node);
  },







  newName(siblings, ext) {
    let base = 'New ' + (ext ? 'File' : 'Folder');
    let name = base + (ext ? '.' + ext : '');
    // console.log(siblings)
    if (!siblings.find(file => file.text === name)) {
      return name;
    }
    for (let i = 1; i < 1000; i++) {
      let name = base + ' (' + i + ')' + (ext ? '.' + ext : '');
      if (!siblings.find(file => file.text === name)) {
        return name;
      }
    }
  },

  newTreeItem(folder) {
    // console.log('newSourceFile', this.currentTree, this.currentTreeNode);
    let alertText;
    if (!this.currentTree) alertText = 'You can not create files or folders only in this section';
    if (folder && !this.permissions[this.currentTree.section].folder.includes('create')) alertText = 'You can not create folder here';
    if (!folder && !this.permissions[this.currentTree.section].file.includes('create')) alertText = 'You can not create file here';

    if (alertText) {
      return this.modules.dialogs.alert(alertText, {
        buttons: {
          'ok': true
        }
      });
    }



    const treeInstance = this.currentTree.instance;
    const section = this.currentTree.section;
    const permissions = folder ? this.permissions[section].folder : this.permissions[section].file;
    const newItem = true;

    let parent, ext, fileType, pos = 'last';

    // console.log(this.currentTreeNode)


    if (this.currentTreeNode) {

      if (this.currentTreeNode.type == 'folder') {
        parent = this.currentTreeNode.id;
        fileType = this.currentTreeNode.original.fileType;
        ext = this.currentTreeNode.original.ext;

        if ((!fileType || !ext) && this.currentTreeNode.children.length) {
          for (let childId of this.currentTreeNode.children) {
            let child = treeInstance.get_node(childId);
            if (child.type != 'folder') {
              ext = child.text.split('.').pop();
              fileType = child.original.fileType || ext;
              ext = child.original.ext || ext;
              break;
            }
          }
        }

        if (!ext) {
          fileType = 'text';
          ext = 'txt';
        }

      } else {
        parent = this.currentTreeNode.parent;
        fileType = this.currentTreeNode.original.type;
        ext = this.currentTreeNode.original.ext;
      }

    } else if (section == 'client') {
      parent = treeInstance.get_node('#');
      fileType = 'html';
      ext = 'html';
    }

    if (!parent) {
      this.modules.dialogs.alert('No parent folder selected')
      if (this.currentTreeNode) console.error('parent not found', this.currentTreeNode.id, treeInstance.get_node(this.currentTreeNode.id));
      return false;
    }
    // const index =
    // console.log(parent);

    const children = [];
    const parentNode = treeInstance.get_node(parent);
    // console.log(this.currentTree.section, this.currentTreeNode, parent, parentNode);


    for (let i = 0; i < parentNode.children.length; i++) {
      if (this.currentTreeNode && parentNode.children[i] == this.currentTreeNode.id) pos = i + 1;
      children.push(treeInstance.get_node(parentNode.children[i]))
    };
    const name = folder ? this.newName(children) : this.newName(children, ext);
    // console.log(name, treeInstance.get_children_dom(parent))
    const node = folder ? this.makeFolder(name, ext, section, permissions, fileType, [], newItem) : this.makeFile(name, ext, section, permissions, fileType, newItem);

    // console.log(node, pos);

    const newId = treeInstance.create_node(parent, node, pos);
    const newNode = treeInstance.get_node(newId);



    treeInstance.deselect_all();
    treeInstance.select_node(newId);
    setTimeout(() => {
      treeInstance.edit(newNode);
    }, 0);
    //[par, node, pos, callback, is_loaded]

    return true;
  },



  contextMenuAction(action, data) {


    const inst = $.jstree.reference(data.reference) || this.currentTree.instance;
    if (!inst) return console.error('No tree found');

    const node = inst.get_node(data.reference);
    if (!['create', 'createFolder'].includes(action) && !node) return console.error('No node found');

    let result = false;

    // console.log('contextMenuAction', action, node.text);

    switch (action) {
      case 'create':
        result = this.newTreeItem();
        break;
      case 'createFolder':
        result = this.newTreeItem(true);
        break;
      case 'rename':
        inst.edit(node);

        if (node.type != 'folder') {
          const ext = node.text.split('.').pop();
          node.original.ext = ext;
        }

        break;
      case 'remove':
        if (inst.is_selected(node)) {
          result = inst.delete_node(inst.get_selected());
        } else {
          result = inst.delete_node(node);
        }
        if (result) {
          if (node.original.new) this.deleteStoredFile(node.id);
          this.selectTreeNode(null);
        }
        break;
      case 'copy':
        if (inst.is_selected(node)) {
          result = inst.copy(inst.get_top_selected());
        } else {
          result = inst.copy(node);
        }
        break;
      case 'cut':
        if (inst.is_selected(node)) {
          result = inst.cut(inst.get_top_selected());
        } else {
          result = inst.cut(node);
        }
        break;
      case 'paste':
        // console.log(node)
        result = inst.paste(node);
        break;
    }

    // console.log(action, node)

    if (!['create', 'createFolder', 'rename', 'remove'].includes(action)) {
      this.saveAndCheckTreeItem(node);
    }

  },

  checkCallback(operation, node, node_parent, node_position, more) {
    // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
    // in case of 'rename_node' node_position is filled with the new node name

    // console.log('checkCallback', operation, node, node_parent, node_position, more);
    // if (operation != 'move_node') console.log(operation, node, node_parent);
    // console.log('checkCallback', operation);
    // const original = node.original;
    // node_parent.id == '#' ? this.
    // const parentPermissions = node_parent.id == '#' ? this.permissions[node.original.section] && this.permissions[node.original.section]
    const section = node.original ? node.original.section : node.section;

    if (!section || !this.permissions[section]) return false;

    const parentPermissions = this.permissions[section] ? this.permissions[section].folder : null;
    const permissions = this.permissions[section] ? this.permissions[section].file : null;

    // console.log(section, this.permissions[section])

    // const parentPermissions = node_parent.original ? node_parent.original.permissions : null;
    // const permissions = node.original ? node.original.permissions : null;
    if (!parentPermissions || !permissions) return false;

    // const permission = operation.split('_')[0];
    // if (node.type == 'folder' && !parentPermissions.includes(permission)) return !!console.error(operation);
    // if (node.type != 'folder' && !permissions.includes(permission)) return !!console.error(operation);

    // if (operation != 'move_node' && !parentPermissions && !permissions) return true;

    switch (operation) {
      case 'move_node':
        // if (permissions && !permissions.move) return false;
        if (node_parent.id != '#' && node_parent.type != 'folder') return false;
        if (node.type == 'folder' && !parentPermissions.includes('move')) return false;
        if (node.type != 'folder' && !permissions.includes('move')) return false;
        break;

      case 'create_node':
        // console.log('create_node', node, node_parent, node_position, more);
        if (node.type == 'folder' && !parentPermissions.includes('create')) return !!console.error(operation);
        if (node.type != 'folder' && !permissions.includes('create')) return !!console.error(operation);

        break;
      case 'edit':
        if (node.type == 'folder' && !parentPermissions.includes('rename')) return !!console.error(operation);
        if (node.type != 'folder' && !permissions.includes('rename')) return !!console.error(operation);

        break;
      case 'rename_node':

        if (node.type == 'folder' && !parentPermissions.includes('rename')) return !!console.error(operation);
        if (node.type != 'folder' && !permissions.includes('rename')) return !!console.error(operation);
        if (node.type == 'folder' && node.text.indexOf('.') != -1) return !!console.error('rename_node');
        if (node.type != 'folder' && node.text.indexOf('.') == -1) return !!console.error('rename_node');
        if (node.type != 'folder' && node_parent.original && node_parent.original.ext && node.text.split('.').pop() != node_parent.original.ext) return !!console.error('rename_node');


        break;

      case 'copy_node':
        if (node.type == 'folder' && !parentPermissions.includes('copy')) return !!console.error(operation);
        if (node.type != 'folder' && !permissions.includes('copy')) return !!console.error(operation);
        break;
      case 'delete_node':
        if (node.type == 'folder' && !parentPermissions.includes('delete')) return !!console.error(operation);
        if (node.type != 'folder' && !permissions.includes('delete')) return !!console.error(operation);



        break;

    }

    // console.log(operation, node)
    if (!['create_node', 'edit'].includes(operation)) {
      this.saveAndCheckTreeItem(node);
    }

    // if (operation == 'create_node') return true;
    return true;
  },


  async saveFile() {


    if (!this.currentTreeNode) return;
    const items = [];
    const item = this.collectChangedNodeData(this.currentTreeNode.id, this.getStoredFile(this.currentTreeNode));
    if (item) items.push(item);
    this.saveChangedNodes(items);

  },

  async saveAllChanges() {

    const changedTreeNodes = this.modules.store.get('changedTreeNodes');
    // console.log(changedTreeNodes);
    if (Object.keys(changedTreeNodes).length == 0) return;

    const items = [];
    let id, item;
    for (id in changedTreeNodes) {
      item = this.collectChangedNodeData(id, changedTreeNodes[id]);
      if (item) items.push(item);
    }

    this.saveChangedNodes(items);
  },

  async saveChangedNodes(items) {

    if (!items.length) return;

    items.sort((a, b) => {
      if ((a.type === 'folder' && b.type === 'folder') || (a.type !== 'folder' && b.type !== 'folder')) return a.path.length - b.path.length;
      if (a.type === 'folder') return -1;
      if (b.type === 'folder') return 1;
      return 0;
    })

    console.log(items);

    const res = await this.modules.transport.send('batchUpdateTenantFiles', {
      items
    });
    if (!res || !res.saved || !res.success) return console.error('Saving failed', res);

    console.log(res);

    for (let id in res.saved) {
      if (res.saved[id].deleted) {
        this.deleteStoredFile(id);
      } else {
        let node = this.trees[res.saved[id].section].instance.get_node(id);
        if (!node) {
          console.error('Node not found', id, res.saved[id]);
          continue;
        }
        if (node.original.new) node.original.new = false;
        this.setStoredFile(node, null, true);
        this.setTreeNodeElementChanged(node);
      }
    }

    return res;
  },

  collectChangedNodeData(id, storedOriginal) {

    let item = {
      id: id,
      section: storedOriginal.section,
      type: storedOriginal.type,
      name: storedOriginal.text,
      path: storedOriginal.path,
    }

    if (storedOriginal.new) item.new = true;

    const node = this.trees[storedOriginal.section].instance.get_node(id);

    if (!node) {
      item.deleted = true;
    } else {
      if (node.type != 'folder') {
        if (typeof node.original.source == 'string') {
          if (node.original.source != storedOriginal.source) item.source = node.original.source;
          // else console.log(node.original.source, storedOriginal.source)
        }
      }
      const currentPath = this.trees[storedOriginal.section].getNodePath(node);
      if (node.text != storedOriginal.text) item.newName = node.text;
      if (currentPath != storedOriginal.path) item.newPath = currentPath;
    }

    for (let changed of ['new', 'deleted', 'source', 'newName', 'newPath']) {
      if (typeof item[changed] != 'undefined') return item;
    }


    return false;
  }



};

export default treesManager;
