/* eslint-disable */
const tree = {

  init(modules) {
    this.modules = modules;
    this.fileTypes = {
      'png': 'image',
      'jpg': 'image',
      'jpeg': 'image',
      'svg': 'image',
      'ico': 'image',
      'gif': 'image'
    }
    // let to = false;
    // $('#jstree_search').keyup(() => {
    //   if (to) {
    //     clearTimeout(to);
    //   }
    //   to = setTimeout(
    //     function () {
    //       const v = $('#jstree_search').val();
    //       this.searchSections(v);
    //       // $(this.selectedSection).jstree(true).search(v);
    //     }.bind(this),
    //     250
    //   );
    // });
  },

  treedata: {
    core: {
      themes: {
        name: 'default-dark',
      },
      force_text: true,
      // check_callback: true,
      check_callback: (operation, node, node_parent, node_position, more) => {

        // operation can be 'create_node', 'rename_node', 'delete_node', 'move_node', 'copy_node' or 'edit'
        // in case of 'rename_node' node_position is filled with the new node name
        console.log(operation, node, node_parent, node_position, more);
        return operation === 'edit' ? true : false;
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
      select_node: false,
      /**
       * an object of actions, or a function that accepts a node and a callback function and calls the callback function with an object of actions available for that node (you can also return the items too).
       *
       * Each action consists of a key (a unique name) and a value which is an object with the following properties (only label and action are required). Once a menu item is activated the `action` function will be invoked with an object containing the following keys: item - the contextmenu item definition as seen below, reference - the DOM node that was used (the tree node), element - the contextmenu DOM element, position - an object with x/y properties indicating the position of the menu.
       *
       * * `separator_before` - a boolean indicating if there should be a separator before this item
       * * `separator_after` - a boolean indicating if there should be a separator after this item
       * * `_disabled` - a boolean indicating if this action should be disabled
       * * `label` - a string - the name of the action (could be a function returning a string)
       * * `title` - a string - an optional tooltip for the item
       * * `action` - a function to be executed if this item is chosen, the function will receive
       * * `icon` - a string, can be a path to an icon or a className, if using an image that is in the current directory use a `./` prefix, otherwise it will be detected as a class
       * * `shortcut` - keyCode which will trigger the action if the menu is open (for example `113` for rename, which equals F2)
       * * `shortcut_label` - shortcut label (like for example `F2` for rename)
       * * `submenu` - an object with the same structure as $.jstree.defaults.contextmenu.items which can be used to create a submenu - each key will be rendered as a separate option in a submenu that will appear once the current item is hovered
       *
       * @name $.jstree.defaults.contextmenu.items
       * @plugin contextmenu
       */
      items: function (o, cb) { // Could be an object directly
        return {
          "create": {
            "separator_before": false,
            "separator_after": true,
            "_disabled": false, //(this.check("create_node", data.reference, {}, "last")),
            "label": "Create",
            "action": function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
              inst.create_node(obj, {}, "last", function (new_node) {
                try {
                  inst.edit(new_node);
                } catch (ex) {
                  setTimeout(function () {
                    inst.edit(new_node);
                  }, 0);
                }
              });
            }
          },
          "rename": {
            "separator_before": false,
            "separator_after": false,
            "_disabled": false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
            "label": "Rename",
            /*!
            "shortcut"			: 113,
            "shortcut_label"	: 'F2',
            "icon"				: "glyphicon glyphicon-leaf",
            */
            "action": function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
              inst.edit(obj);
            }
          },
          "remove": {
            "separator_before": false,
            "icon": false,
            "separator_after": false,
            "_disabled": false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
            "label": "Delete",
            "action": function (data) {
              var inst = $.jstree.reference(data.reference),
                obj = inst.get_node(data.reference);
              if (inst.is_selected(obj)) {
                inst.delete_node(inst.get_selected());
              } else {
                inst.delete_node(obj);
              }
            }
          },
          "ccp": {
            "separator_before": true,
            "icon": false,
            "separator_after": false,
            "label": "Edit",
            "action": false,
            "submenu": {
              "cut": {
                "separator_before": false,
                "separator_after": false,
                "label": "Cut",
                "action": function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  if (inst.is_selected(obj)) {
                    inst.cut(inst.get_top_selected());
                  } else {
                    inst.cut(obj);
                  }
                }
              },
              "copy": {
                "separator_before": false,
                "icon": false,
                "separator_after": false,
                "label": "Copy",
                "action": function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  if (inst.is_selected(obj)) {
                    inst.copy(inst.get_top_selected());
                  } else {
                    inst.copy(obj);
                  }
                }
              },
              "paste": {
                "separator_before": false,
                "icon": false,
                "_disabled": function (data) {
                  return !$.jstree.reference(data.reference).can_paste();
                },
                "separator_after": false,
                "label": "Paste",
                "action": function (data) {
                  var inst = $.jstree.reference(data.reference),
                    obj = inst.get_node(data.reference);
                  inst.paste(obj);
                }
              }
            }
          }
        };
      }
    }
  },

  makeTree(el, data) {

  },

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
  },

  sourceFileSaved(file) {
    const treeItem = document.getElementById(file.id);
    if (!treeItem) return console.log('treeItem not found', file.id);
    treeItem.classList.remove('changed');
  },

  searchSections(str) {
    this.elements.sections
      .querySelectorAll('.side-bar-section')
      .forEach((section) => {
        $(section).jstree(true).search(str);
      });
  },

  showContextMenu(event, data) {
    // console.log(event);
    // console.log(data);
  }


}
export default tree;
