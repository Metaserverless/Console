/* eslint-disable */

const joint = window.joint;
const dagre = window.dagre;
const graphlib = window.graphlib;

class baseDiagram {
  constructor(id, modules) {
    this.id = id;
    this.modules = modules;

    const element = document.getElementById(id);
    if (!element) return console.error('element not found', id);

    this.paper = null;
    this.graph = null;
    this.scale = 1;
    this.origin = { x: 0, y: 0 };
    this.pan = { x: 0, y: 0 };
    // this.flow = null;

    const namespace = joint.shapes;
    const graph = new joint.dia.Graph({}, { cellNamespace: namespace });

    const paper = new joint.dia.Paper({
      el: element,
      model: graph,
      width: '100%',
      height: '100%',
      cellViewNamespace: namespace,
      async: true,
      frozen: true,
      preventContextMenu: false,
      gridSize: 10,
      drawGrid: true,
      // sorting: joint.dia.Paper.sorting.NONE,
      // sorting: joint.dia.Paper.sorting.APPROX,

      //...INPUTS

      //....MOVE
      interactive: (cellView) => {
        return {
          elementMove: false,
        };
        // if (cellView.model.get('locked')) {
        //     return {
        //          elementMove: false
        //     };
        // }
        // // otherwise
        // return {
        //     linkMove: false
        // };
      },

      //....PORTS AND LINKS
      // linkPinning: false, // Prevent link being dropped in blank paper area
      // defaultLink: (cellView, magnet)=>{return Link.defaultLink(cellView, magnet, this.defs.gradients.link)},
      // defaultLink: (cellView, magnet)=>{return Link.defaultLink(cellView, magnet)},
      defaultConnectionPoint: { name: 'boundary' },

      //....GROUPS
      viewport: (cellView) => {
        var element = cellView.model;
        //  console.log(element.id, element.getAncestors().length);
        // Hide any element or link which is embedded inside a collapsed parent (or parent of the parent).
        var hidden = element.getAncestors().some((ancestor) => {
          return ancestor.isCollapsed ? ancestor.isCollapsed() : false;
        });
        return !hidden;
      },
    });

    //..........GROUPS

    paper.on(
      'group:toggle:button:pointerdown',
      this.groupToggleButtonPointerdownHandler.bind(this)
    );

    //..........ZOOM

    paper.on('blank:mousewheel', this.canvasMousewheelHandler.bind(this));

    paper.on('cell:mousewheel', (cellView, e, x, y, delta) => {
      return this.canvasMousewheelHandler(e, x, y, delta);
    });

    //..........PAN OR SELECT

    paper.on('blank:pointerdown', this.blankPointerdownHandler.bind(this));

    paper.on('blank:pointerup', this.blankPointerupHandler.bind(this));

    paper.on('blank:pointermove', this.blankPointermoveHandler.bind(this));

    this.graph = graph;
    this.paper = paper;
  }

  //...........UPDATE ELEMENTS AND LINKS

  updateGraph(flow) {
    // console.log(flow)
    this.paper.freeze();
    this.graph.clear();
    let cells = [],
      main,
      previous,
      node,
      element,
      link,
      pair;

    if (!flow[0] || !flow[0].body) {
      console.error('flow is empty');
      this.paper.unfreeze();
      return;
    }

    const types = ['success', 'fail', 'finalization'];

    for (let step of flow[0].body) {
      //{command: 'Form "Order"', success: Array(0), fail: Array(0), finalization: Array(0)}

      for (let type of types) {
        for (let command of step[type]) {
          pair = this.createElementAndLink(
            type,
            { command, embeds: this.findEmbeds(flow, command) },
            previous
          );
          cells.push(pair.element);
          if (pair.link) cells.push(pair.link);
        }
        if (type == 'success') {
          pair = this.createElementAndLink(
            'main',
            {
              command: step.command,
              embeds: this.findEmbeds(flow, step.command),
            },
            previous
          );
          main = pair.element;
          cells.push(pair.element);
          if (pair.link) cells.push(pair.link);
        }
      }
      previous = main;
    }
    this.graph.addCells(cells);

    this.directedGraph();
    this.paper.unfreeze();
    document.dispatchEvent(
      new CustomEvent('diagram.header.change', { detail: flow[0].name })
    );
  }

  findEmbeds(flow, command) {
    for (let i = 1; i < flow.length; i++) {
      if (command == flow[i].name) {
        // console.log(command, flow[i].name)
        return flow[i].body;
      }
    }
    return null;
  }

  createElementsANdLinks() {}

  createElementAndLink(type, node, previous) {
    const element = this.createElement(type, node);
    // if (type == 'main') console.log(node)
    const link = previous ? this.createLink(type, previous, element) : null;
    return { element, link };
  }

  createElement(type, node) {
    const colors = {
      main: '#2f76fe',
      success: '#cdcdcd',
      fail: '#e6c456',
      finalization: '#e6c456',
    };
    const width = 150,
      height = 60;
    const text = node.command;

    // console.log(node)

    const wraptext = joint.util.breakText(text, {
      width: width,
      height: height,
    });

    const options = {
      z: 1,
      size: { width, height },
      attrs: {
        body: {
          fill: type == 'finalization' ? '#990004' : '#000000',
          stroke: colors[type],
          strokeWidth: 2,
        },
        label: {
          text: wraptext,
          fill: colors[type],
        },
      },
    };

    if (node.embeds) {
      // console.log(node.embeds);

      options.attrs.toggleButton = {
        refDx: -20,
        // refDx: (- buttonSize * 2 - (headerHeight - buttonSize) / 2) - 5,
        // refY: 0,
        cursor: 'pointer',
        event: 'group:toggle:button:pointerdown',
        title: 'Collapse / Expand',
      };

      options.attrs.toggleButtonBorder = {
        fill: 'transparent',
        stroke: colors[type],
        strokeWidth: 2,
        width: '20',
        height: '20',
        class: 'embeds-button',
      };
      options.attrs.toggleButtonIcon = {
        stroke: colors[type],
        strokeWidth: 2,
        d: 'M 4 10 16 10 M 10 4 10 16', //'M 4 14 16 14'
      };

      options.markup = [
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
      ];
    }

    const element = new joint.shapes.standard.Rectangle(options);
    element.prop('data', node);

    return element;
  }

  createLink(type, source, target) {
    const colors = {
      main: '#2f76fe',
      success: '#00e60a',
      fail: '#ff1a00',
      finalization: '#ff1a00',
    };
    const link = new joint.shapes.standard.Link({
      z: 0,
      source: source,
      target: target,
      attrs: {
        line: {
          stroke: colors[type],
          'stroke-width': 2,
        },
      },
    });
    return link;
  }

  directedGraph(cells) {
    const graphBBox = joint.layout.DirectedGraph.layout(cells || this.graph, {
      nodeSep: 50,
      edgeSep: 80,
      marginX: 50,
      marginY: 50,
      rankDir: 'LR',
      resizeClusters: true,
      clusterPadding: { left: 10, right: 10, top: 54, bottom: 10 },
      dagre,
      graphlib,
      // ranker: 'longest-path',
      // ranker: 'tight-tree',
      ranker: 'network-simplex',
    });

    // console.log('x:', graphBBox.x, 'y:', graphBBox.y)
    // console.log('width:', graphBBox.width, 'height:', graphBBox.height);
  }

  //..........GROUPS

  groupToggleButtonPointerdownHandler(elementView) {
    var element = elementView.model;
    console.log('groupToggleButtonPointerdownHandler', element.prop('data'));
    // this.deselectAllElements();
    // this.paper.freeze();
    // element.toggle();
    // this.fitAncestors(element);
    // this.paper.unfreeze();
  }

  expandEmbeds(element) {
    const embeds = element.prop('data').embeds;
  }

  expandEmbeds2(element) {
    const embeds = element.prop('data').embeds;
  }

  fitAncestors(element) {
    element.getAncestors().forEach((container) => {
      // console.log(container.id)
      if (container.fitChildren && !container.get('collapsed'))
        container.fitChildren();
    });
  }

  //..........ZOOM

  canvasMousewheelHandler(e, x, y, delta) {
    e.preventDefault();

    const oldScale = this.paper.scale().sx;
    const newScale = oldScale + delta * 0.1;

    this.scaleToPoint(newScale, x, y);

    return false;
  }

  scaleToPoint(nextScale, x, y) {
    const MIN_SCALE = 0.2;
    const MAX_SCALE = 4;
    if (nextScale >= MIN_SCALE && nextScale <= MAX_SCALE) {
      const currentScale = this.paper.scale().sx;

      const beta = currentScale / nextScale;

      const ax = x - x * beta;
      const ay = y - y * beta;

      const translate = this.paper.translate();

      this.pan.x = translate.tx - ax * nextScale;
      this.pan.y = translate.ty - ay * nextScale;
      // const nextTx = translate.tx - ax * nextScale;
      // const nextTy = translate.ty - ay * nextScale;

      this.paper.translate(this.pan.x, this.pan.y);

      const ctm = this.paper.matrix();

      ctm.a = nextScale;
      ctm.d = nextScale;

      this.paper.matrix(ctm);
      this.paper.drawGrid();
      this.scale = nextScale;

      // const event = new CustomEvent('diagram.scale.change', { scale: nextScale });
      document.dispatchEvent(
        new CustomEvent(this.id + ':scale:change', { detail: nextScale })
      );
      // this.updateScale(nextScale);
    }
  }

  //.......PAN

  blankPointerdownHandler(evt, x, y) {
    const scale = this.paper.scale();
    this.origin.x = x * scale.sx;
    this.origin.y = y * scale.sy;

    this.paper.el.classList.add('cursor-grabbing');
    return false;
  }

  blankPointerupHandler(evt, x, y) {
    this.paper.el.classList.remove('cursor-grabbing');
    return false;
  }

  blankPointermoveHandler(evt, x, y) {
    //  console.log(x, this.origin.x, y, this.origin.y, evt.offsetX);
    // console.log(evt)// c    onsole.log('blank:pointermove')

    x = evt.offsetX;
    y = evt.offsetY;

    if (
      this.origin.x &&
      this.origin.y &&
      (x != this.origin.x || y != this.origin.y)
    ) {
      this.pan.x = x - this.origin.x;
      this.pan.y = y - this.origin.y;
      this.paper.translate(this.pan.x, this.pan.y);
    }

    return false;
  }
}

export default baseDiagram;
