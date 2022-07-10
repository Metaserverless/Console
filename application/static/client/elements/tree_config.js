/* eslint-disable */

const icons = {
  // server: {
  //   icon: '/client/img/folder_type_server.svg',
  // },
  // client: {
  //   icon: '/client/img/folder_type_client.svg',
  // },
  folder: {
    icon: false,
  },
  process: {
    icon: '/client/img/file_type_puppet.svg',
  },
  procedure: {
    icon: '/client/img/file_type_js.svg', //"fab fa-markdown"
  },
  rpc: {
    icon: '/client/img/file_type_js.svg', //"fab fa-markdown"
  },
  schema: {
    icon: '/client/img/file_type_js.svg', //"fab fa-markdown"
  },
  md: {
    icon: '/client/img/markdown.svg', //"fab fa-markdown" //file_type_markdown.svg
  },
  sql: {
    icon: '/client/img/file_type_sql.svg',
  },
  postgres: {
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
  text: {
    icon: '/client/img/file_type_text.svg',
  },
  yaml: {
    icon: '/client/img/file_type_yaml.svg',
  },
  image: {
    icon: '/client/img/file_type_image.svg',
  },
}

const make = function (manager, section, data) {

  console.log(section)

  return {
    core: {
      themes: {
        name: 'default-dark',
      },
      multiple: false,
      force_text: true,
      check_callback: manager.checkCallback.bind(manager),
      data: data,
    },
    types: icons,
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
      key: section.type,
    },
    contextmenu: {
      select_node: true,
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

        // console.log(o)
        const original = o.original;


        const create = {
          "separator_before": false,
          "separator_after": false,
          "_disabled": false, //(this.check("create_node", data.reference, {}, "last")),
          "label": "Create",
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   inst.create_node(obj, {}, "last", function (new_node) {
          //     try {
          //       inst.edit(new_node);
          //     } catch (ex) {
          //       setTimeout(function () {
          //         inst.edit(new_node);
          //       }, 0);
          //     }
          //   });
          // },
          "action": (data) => manager.contextMenuAction('create', data)
        };

        const createFolder = {
          "separator_before": false,
          "separator_after": true,
          "_disabled": false, //(this.check("create_node", data.reference, {}, "last")),
          "label": "Create Folder",
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   inst.create_node(obj, {}, "last", function (new_node) {
          //     try {
          //       inst.edit(new_node);
          //     } catch (ex) {
          //       setTimeout(function () {
          //         inst.edit(new_node);
          //       }, 0);
          //     }
          //   });
          // },
          "action": (data) => manager.contextMenuAction('createFolder', data)
        };

        const uploadImage = {
          "separator_before": false,
          "separator_after": true,
          "_disabled": section.type !== 'client', //(this.check("create_node", data.reference, {}, "last")),
          "label": "Upload Image",
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   inst.create_node(obj, {}, "last", function (new_node) {
          //     try {
          //       inst.edit(new_node);
          //     } catch (ex) {
          //       setTimeout(function () {
          //         inst.edit(new_node);
          //       }, 0);
          //     }
          //   });
          // },
          "action": (data) => manager.contextMenuAction('uploadImage', data)
        };

        const rename = {
          "separator_before": false,
          "separator_after": false,
          "_disabled": false, //(this.check("rename_node", data.reference, this.get_parent(data.reference), "")),
          "label": "Rename",
          /*!
          "shortcut"			: 113,
          "shortcut_label"	: 'F2',
          "icon"				: "glyphicon glyphicon-leaf",
          */
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   inst.edit(obj);
          // }
          "action": (data) => manager.contextMenuAction('rename', data)
        };

        const remove = {
          "separator_before": false,
          "icon": false,
          "separator_after": false,
          "_disabled": false, //(this.check("delete_node", data.reference, this.get_parent(data.reference), "")),
          "label": "Delete",
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   if (inst.is_selected(obj)) {
          //     inst.delete_node(inst.get_selected());
          //   } else {
          //     inst.delete_node(obj);
          //   }
          // }
          "action": (data) => manager.contextMenuAction('remove', data)
        };

        const cut = {
          "separator_before": true,
          "separator_after": false,
          "label": "Cut",
          "_disabled": false,
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   if (inst.is_selected(obj)) {
          //     inst.cut(inst.get_top_selected());
          //   } else {
          //     inst.cut(obj);
          //   }
          // }
          "action": (data) => manager.contextMenuAction('cut', data)
        };

        const copy = {
          "separator_before": false,
          "icon": false,
          "separator_after": false,
          "label": "Copy",
          "_disabled": false,
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   if (inst.is_selected(obj)) {
          //     inst.copy(inst.get_top_selected());
          //   } else {
          //     inst.copy(obj);
          //   }
          // }
          "action": (data) => manager.contextMenuAction('copy', data)
        };

        const paste = {
          "separator_before": false,
          "icon": false,
          "_disabled": function (data) {
            return !$.jstree.reference(data.reference).can_paste();
          },
          "separator_after": false,
          "label": "Paste",
          // "action": function (data) {
          //   var inst = $.jstree.reference(data.reference),
          //     obj = inst.get_node(data.reference);
          //   inst.paste(obj);
          // }
          "action": (data) => manager.contextMenuAction('paste', data)
        }

        // const edit = {
        //   "separator_before": true,
        //   "icon": false,
        //   "separator_after": false,
        //   "label": "Edit",
        //   "action": false,
        //   "submenu": {
        //     cut,
        //     copy,
        //     paste
        //   }
        // }

        const result = section.type == 'client' ? {
          create,
          createFolder,
          uploadImage,
          rename,
          remove,
          cut,
          copy,
          paste
          // edit
        } : {
          create,
          rename,
          remove,
          cut,
          copy,
          paste
        }

        return result;
      }
    }
  }
};

export default {
  make,
  icons
};
