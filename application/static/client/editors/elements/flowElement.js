// import { callbackify } from "util";

/* eslint-disable */
const joint = window.joint;

const descriptions = {
  instance: {
    z: 1,
    // size: { width: 250, height: 120 },
    attrs: {
      body: {
        refWidth: '100%',
        refHeight: '100%',
        strokeWidth: 2,
      },
      toggleButton: {
        refDx: -20,
        cursor: 'pointer',
        event: 'group:toggle:button:pointerdown',
        title: 'Collapse / Expand',
      },
      toggleButtonBorder: {
        fill: 'transparent',
        strokeWidth: 2,
        width: '20',
        height: '20',
      },
      toggleButtonIcon: {
        fill: 'none',
        strokeWidth: 2,
      },
      label: {
        textVerticalAnchor: 'middle',
        textAnchor: 'middle',
        fontSize: 14,
        whiteSpace: 'pre',
        x: 'calc(0.5*w)',
        y: 'calc(0.5*h)',
      },
    },
  },
  class: {
    markup: [
      {
        tagName: 'rect',
        selector: 'body',
      },
      {
        tagName: 'g',
        selector: 'toggleButton',
        children: [
          {
            tagName: 'rect',
            selector: 'toggleButtonBorder',
          },
          {
            tagName: 'path',
            selector: 'toggleButtonIcon',
          },
        ],
      },
      {
        tagName: 'text',
        selector: 'label',
      },
    ],

    lastPosition: null,
    children: [],
    // childrenLinks:[],
    links: {},

    toggle: function (shouldCollapse) {
      // console.log('toggle');
      // console.error('shouldCollapse', shouldCollapse);
      var buttonD;
      var collapsed =
        shouldCollapse === undefined ? !this.get('collapsed') : shouldCollapse;

      if (collapsed) {
        // this.toggleEmbeddedLinks(collapsed);
        // this.toggleEmbeddedCells(collapsed);

        // buttonD = 'M 2 7 12 7 M 7 2 7 12';
        buttonD = 'M 4 10 16 10 M 10 4 10 16';

        // console.log(this.links)
      } else {
        // this.toggleEmbeddedCells(collapsed);
        //  this.toggleEmbeddedLinks(collapsed);

        buttonD = 'M 4 10 16 10';
      }
      // this.toggleSize(collapsed);
      this.attr(['toggleButtonIcon', 'd'], buttonD);
      this.set('collapsed', collapsed);
    },

    toggleSize: function (collapsed) {
      let width = 150;
      // const el = document.querySelector('[model-id="' + this.id + '"]');
      // if (el) {
      //   const icon = el.querySelector('[joint-selector="icon"]');
      //   const header = el.querySelector('[joint-selector="headerText"]');
      //   const button = el.querySelector('[joint-selector="toggleButton"]');
      //   if (header) {
      //     const tspan = header.firstChild;

      //     // width = Math.round(icon.getBoundingClientRect().width + tspan.getBoundingClientRect().width + button.getBoundingClientRect().width);
      //     width = Math.round(
      //       44 +
      //         tspan.getBoundingClientRect().width +
      //         10 +
      //         buttonSize +
      //         (headerHeight - buttonSize) / 2
      //     );
      //     // console.log(tspan.getBoundingClientRect().width)
      //     // header.setAttribute('text-anchor', collapsed ? 'end' : 'start');
      //   }
      // }
      if (collapsed) {
        this.resize(width, 44);
      } else {
        if (this.getEmbeddedCells().length) {
          this.fitChildren();
          const size = this.prop('size');
          if (size.width < width) {
            this.resize(width, size.height);
          }
        } else {
          this.resize(width, 100);
        }
      }
    },

    toggleEmbeddedLinks: function (collapsed) {
      if (!this.graph) return;
      if (collapsed) {
        this.links = {};
        let inbound = this.graph.getConnectedLinks(this, {
          inbound: true,
          deep: true,
        });
        let outbound = this.graph.getConnectedLinks(this, {
          outbound: true,
          deep: true,
        });
        for (let l of inbound) {
          // if (l.prop('parent') == this.prop('id')) continue;
          this.links[l.id] = {
            source: l.prop('source'),
            target: l.prop('target'),
          };
          l.prop('target', { id: this.prop('id') });
        }

        for (let l of outbound) {
          // if (l.prop('parent') == this.prop('id')) continue;
          this.links[l.id] = {
            source: l.prop('source'),
            target: l.prop('target'),
          };
          l.prop('source', { id: this.prop('id') });
        }
      } else {
        let links = this.graph.getConnectedLinks(this);
        // console.log(Object.keys(this.links).length)
        for (let link of links) {
          if (!this.links[link.id]) continue;
          link.prop('source', this.links[link.id].source);
          link.prop('target', this.links[link.id].target);
        }
        this.links = {};
      }
    },

    toggleEmbeddedCells: function (collapsed) {
      if (!this.graph) return;
      if (collapsed) {
        this.lastPosition = this.prop('position');
        // console.log(this.lastPosition);
        this.children = this.getEmbeddedCells();
        for (let c of this.children) {
          if (c.toggle) c.toggle(collapsed);
        }
        this.graph.removeCells(this.children);
      } else {
        // console.log(this.children.length);
        let offset = null;
        if (this.lastPosition) {
          const pos = this.prop('position');
          if (pos.x != this.lastPosition.x || pos.y != this.lastPosition.y) {
            offset = {
              x: pos.x - this.lastPosition.x,
              y: pos.y - this.lastPosition.y,
            };
            // this.lastPosition = pos;
          }
        }

        this.graph.addCells(this.children);
        for (let cell of this.children) {
          if (offset) {
            let pos = cell.prop('position');
            // console.log(offset, pos)
            if (pos)
              cell.prop('position', {
                x: pos.x + offset.x,
                y: pos.y + offset.y,
              });
          }
          this.embed(cell);
        }
        this.children = [];
      }
    },

    isCollapsed: function () {
      return Boolean(this.get('collapsed'));
    },

    fitChildren: function () {
      var padding = 20;
      // console.log(this.id, this.getEmbeddedCells().length)
      this.fitEmbeds({
        padding: {
          top: padding,
          left: padding,
          right: padding,
          bottom: padding,
        },
      });
    },
  },
  static: {},
};

if (!joint.shapes.html) joint.shapes.html = {};
if (!joint.shapes.html.FlowElement) {
  joint.shapes.html.FlowElement = joint.dia.Element.define(
    'html.FlowElement',
    descriptions.instance,
    descriptions.class,
    descriptions.static
  );
}
const element = new joint.shapes.html.FlowElement();

function generateRandomColorHex() {
  return (
    '#' +
    ('00000' + Math.floor(Math.random() * Math.pow(16, 6)).toString(16)).slice(
      -6
    )
  );
}

const FlowElement = {
  newElement(node) {
    // console.log(config.size);

    const cell = element.clone();

    //....IF YOU PROVIDE THE SAME ID TO THE ELEMENT IT DOES NOT REDARAW THE ELEMENT, SO USE updateCell PER LINE EDITING
    // if (node.id) cell.prop('id', node.id);
    // else if (node.index !== undefined) cell.prop('id', 'node' + node.index);

    const colors = {
      step: '#2f76fe',
      success: '#cdcdcd',
      fail: '#e6c456',
      finalization: '#e6c456',
    };
    const width = 150,
      height = 60;
    const text = node.name;
    const type = node.type;

    // console.log(node)

    const wraptext = joint.util.breakText(text, {
      width: width,
      height: height,
    });

    cell.size(width, height);
    //
    cell.attr(['body', 'fill'], type == 'finalization' ? '#990004' : '#000000');
    cell.attr(['body', 'stroke'], colors[type]);
    cell.attr(['label', 'text'], wraptext);
    cell.attr(['label', 'fill'], colors[type]);

    if (node.body) {
      cell.set('collapsed', true);
      cell.attr(['toggleButtonBorder', 'stroke'], colors[type]);
      cell.attr(['toggleButtonIcon', 'stroke'], colors[type]);
      cell.attr(['toggleButtonIcon', 'd'], 'M 4 10 16 10 M 10 4 10 16');
    } else {
      cell.attr(['toggleButton', 'display'], 'none');
    }
    // this.updateCell(config, cell);
    return cell;
  },

  updateCell(config, cell) {
    if (config.size) cell.prop('size', config.size);
    if (config.attrs) {
      for (let key in config.attrs) {
        cell.attr(key, config.attrs[key]);
      }
    }
  },
};

export default FlowElement;
