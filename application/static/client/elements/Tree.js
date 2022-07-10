/* eslint-disable */

// import sources from './trees.js

class Tree {

  constructor(el, section, treeconfig, modules) {
    this.el = el;

    this.section = section;
    this.modules = modules;
    // this.data = treeconfig.core.data;
    // this.flatData = [];
    this.active = false;
    this.ready = false;


    $(el)
      .jstree(treeconfig)
      .on('ready.jstree', () => {
        this.ready = true;
        this.modules.events.emit('tree-is-ready', this.section)
      })
      .on('changed.jstree', this.selectTreeItem.bind(this))
      .on("create_node.jstree", (e, data) => {
        // console.log(data);
        // data.node.original.path = this.getNodePath(data.node);
        this.modules.events.emit('new-node-created', data.node);
      })
      .on("copy_node.jstree", (e, data) => {
        // console.log(data)
        // data.node.data = $.extend(true, {}, data.original.data);
        if (data.node.id != data.original.id) {
          data.node.original = $.extend(true, {}, data.original.original);

          data.node.original.new = true;
          // data.node.original.path = this.getNodePath(data.node);
          this.modules.events.emit('new-node-from-copy', data.node);

        }

      })
      .on("move_node.jstree", (e, data) => {
        // console.log(data);

        // data.node.original.path = this.getNodePath(data.node);
        this.modules.events.emit('node-moved', data.node);

      })
      .on("rename_node.jstree", (e, data) => {
        // console.log(data);
        // data.node.original.path = this.getNodePath(data.node);
        // data.node.original.text = data.node.text;
        this.modules.events.emit('node-renamed', data.node);
      });
    // .on("cut.jstree", (e, data) => {
    //   console.log(data);
    //   // data.node.original.path = this.getNodePath(data.node);
    // })
    // .on("paste.jstree", (e, data) => {
    //   // console.log(data);
    //   const node = data.node[0];
    //   // node.original.path = this.getNodePath(node);
    // });
    // .on('show_contextmenu.jstree', this.showContextMenu.bind(this));


    this.instance = $(el).jstree(true);

  }


  selectTreeItem(e, data) {

    // console.log(data.action)

    if (data.action != 'select_node') return;
    // console.log(data.node.original);
    // this.getNodeParentPath(data.node)

    data.node.original.path = this.getNodePath(data.node);
    this.modules.events.emit('tree-item-selected', data.node);

  }


  getNodePath(node) {
    const path = this.instance.get_path(node);
    return path.join('/');
  }

  getNodeParentPath(node) {
    const path = this.instance.get_path(node.parent);
    return path ? path.join('/') : '';
  }

  updateData(data) {
    this.instance.settings.core.data = this.data = data;
    this.instance.refresh();
    // $('#treeView').jstree(true).refresh_node("node_id_here")
  }



}




export default Tree;
