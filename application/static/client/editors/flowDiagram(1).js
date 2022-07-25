/* eslint-disable */
const joint = window.joint;
import baseDiagram from './baseDiagram.js';
import flowElement from './elements/flowElement.js';
class flowDiagram extends baseDiagram {
  constructor(id, modules) {
    super(id, modules);
  }

  //...........UPDATE ELEMENTS AND LINKS

  updateGraph(procedures) {
    //  console.log(procedures[0])
    this.paper.freeze();
    this.graph.clear();

    if (!procedures[0] || !procedures[0].body || !procedures[0].body.length) {
      console.error('no procedures');
      this.paper.unfreeze();
      return;
    }

    const { elements, links } = this.createElementsAndLinks(procedures[0].body);
    console.log(procedures[0].body[0].name, elements[0].prop('data').name);

    this.graph.addCells(elements);
    this.graph.addCells(links);

    this.directedGraph();
    this.paper.unfreeze();
    // this.modules.events.emit(this.id + ':header:change', procedures[0].name);
  }

  createElementsAndLinks(procedureBody) {
    const result = { elements: [], links: [] };

    if (!Array.isArray(procedureBody) || !procedureBody.length) return result;

    const types = ['success', 'fail', 'finalization'];

    const firstStep = this.createElement(procedureBody[0]);
    let previousStep = firstStep,
      main,
      element,
      link;

    for (let i = 0; i < procedureBody.length; i++) {
      let step = procedureBody[i];
      let nextStep = procedureBody[i + 1];

      for (let type of types) {
        for (let node of step[type]) {
          element = this.createElement(node);
          result.elements.push(element);
          if (previousStep)
            result.links.push(this.createLink(previousStep, element));
        }

        if (type == 'success' && nextStep) {
          main = element = this.createElement(nextStep);
          result.elements.push(element);
          if (previousStep)
            result.links.push(this.createLink(previousStep, element));
        }
      }

      previousStep = main;
    }

    result.elements.unshift(firstStep);

    return result;
  }

  createElement(node) {
    const element = flowElement.newElement(node);
    element.prop('data', node);
    if (node.body) {
      // console.log(node.body)
    }
    return element;
  }

  createLink(source, target) {
    const type = target.prop('data').type;
    const colors = {
      step: '#2f76fe',
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

  //..........GROUPS

  groupToggleButtonPointerdownHandler(elementView) {
    const parent = elementView.model;
    const data = parent.prop('data');
    if (!data || !data.body) return;

    this.modules.events.emit(this.id + ':group:toggle', data);

    // console.log(data.id);
    // console.log('groupToggleButtonPointerdownHandler', data);
    // const steps = [];

    // this.modules.dialogs.alert(
    //   '<ol class="flow-diagram-embeds-list">' +
    //     data.body
    //       .map((e) => `<li>${e.name.replaceAll('`', '')}</li>`)
    //       .join('') +
    //     '</ol>',
    //   { title: data.name, buttons: { ok: true } }
    // );

    // this.deselectAllElements();

    // this.paper.freeze();
    // const children = parent.children;
    // // console.log(element, children)

    // if (!children.length) {
    //   const res = this.createElementsAndLinks(data.body);
    //   const {elements, links} = res;
    //   // console.log(data.body);
    //   // console.log(res)
    //   // console.log(element)
    //   //  console.log(cells)
    //   //  console.log(links)

    //    this.graph.addCells(elements);
    //    this.graph.addCells(links);

    //   // for (let child of elements) {
    //   //   element.embed(child);
    //   // }
    //   // for (let link of links) {
    //   //    link.reparent();
    //   // }
    //   parent.children = elements;

    //   this.resizeParent(parent, elements, links)
    //   // this.directedGraph(elements);
    //   // element.toggle(false);
    // }

    // parent.toggle();
    // // this.fitAncestors(parent);
    // // this.directedGraph();
    // this.paper.unfreeze();
  }

  // resizeParent(parent, elements, links){
  //     // const cells = elements.concat(links);
  //     this.directedGraph(elements);
  //     const clone = parent.clone();
  //     this.graph.addCell(clone);
  //     for (let element of elements) {
  //         clone.embed(element);
  //     }
  //     clone.fitEmbeds({padding: { top: 30, left: 10, right: 10, bottom: 10 }});
  //     parent.resize(clone.getBBox().width, clone.getBBox().height);
  //     this.directedGraph();
  //     const dx = parent.getBBox().x - clone.getBBox().x;
  //     const dy = parent.getBBox().y - clone.getBBox().y;
  //     clone.translate(dx, dy);
  //     clone.remove();
  //     for (let element of elements) {
  //       parent.embed(element);
  //     }
  //     for (let link of links) {
  //       link.reparent();
  //     }

  // }

  // expandEmbeds(element) {
  //   const embeds = element.prop('data').body;
  // }

  // expandEmbeds2(element) {
  //   const embeds = element.prop('data').body;
  // }

  // fitAncestors(element) {
  //   element.getAncestors().forEach((container) => {
  //     // console.log(container.id)
  //     if (container.fitChildren && !container.get('collapsed'))
  //       container.fitChildren();
  //   });
  // }
}

export default flowDiagram;
