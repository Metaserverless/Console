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
        data.node.original.path = this.getNodePath(data.node);
        this.modules.events.emit('new-node-created', data.node);
      })
      .on("copy_node.jstree", (e, data) => {
        // console.log(data)
        // data.node.data = $.extend(true, {}, data.original.data);
        if (data.node.id != data.original.id) {
          data.node.original = $.extend(true, {}, data.original.original);

          data.node.original.new = true;
          data.node.original.path = this.getNodePath(data.node);
          this.modules.events.emit('new-node-from-copy', data.node);

        }

      })
      .on("move_node.jstree", (e, data) => {
        // console.log(data);
        this.modules.events.emit('node-moved', data.node);
        data.node.original.path = this.getNodePath(data.node);

      })
      .on("rename_node.jstree", (e, data) => {
        // console.log(data);
        data.node.original.path = this.getNodePath(data.node);
        data.node.original.text = data.node.text;
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



  // makeFlatData(ids) {
  //   let res = [],
  //     instance = $(this.el).jstree(true),
  //     item;
  //   for (let id of ids) {
  //     item = instance.get_node(id)
  //     res.push(item);
  //     if (item.children) res.push(...this.makeFlatData(item.children))
  //   }
  //   return res;
  // }




  selectTreeItem(e, data) {

    // console.log(data.action)

    if (data.action != 'select_node') return;
    console.log(data.node.original);

    data.node.original.path = this.getNodePath(data.node);
    this.modules.events.emit('tree-item-selected', data.node);

  }


  getNodePath(node) {
    const path = $(this.el).jstree(true).get_path(node);
    return path.join('/');
  }

  updateData(data) {
    this.el.jstree(true).settings.core.data = this.data = data;
    this.el.jstree(true).refresh();
    // $('#treeView').jstree(true).refresh_node("node_id_here")
  }



}




export default Tree;
