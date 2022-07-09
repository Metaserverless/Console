/* eslint-disable */
import parser from '../utilities/flow_parser.js';
import flowDiagram from '../editors/flowDiagram.js';
import codeEditor from '../editors/baseCodeEditor.js';
import form from '../editors/form.js';

class controllerDiagram {
  constructor(id, modules) {
    this.modules = modules;
    this.view = 'Diagram';

    const codeEditorContainer = document.getElementById(
      'diagram-code-editor-container'
    );

    this.elements = {
      processRunButton: document.getElementById('process-run-button'),
      // processSaveButton: document.getElementById('process-save-button'),
      paper: document.getElementById('diagram-paper'),
      popup: document.getElementById('flow-diagram-popup'),
      // diagramHeader:document.getElementById('diagram-header'),
      // processesSelect:document.getElementById('processes-select'),
      scale: document.getElementById('diagram-scale'),
      codeEditorContainer,
      codeEditor: codeEditorContainer.querySelector('#diagram-code-editor'),
      codeEditorDivider: codeEditorContainer.querySelector(
        '#diagram-code-editor-divider'
      ),
      closeBtn: codeEditorContainer.querySelector('.code-editor-close-button'),
      openBtn: codeEditorContainer.querySelector('.code-editor-open-button'),
      // formComponent:document.getElementById('form_component'),
    };
    this.original = '';
    this.lines = [];
    this.cleanLines = [];
    this.objects = [];
    // (this.rgs = {
    //   empty: /^\s*$/,
    //   regular: /^\s+/,
    //   number: /^\s*\#\s*/,
    //   star: /^\s*\*\s*/,
    //   arrow: /^\s*-\s*\>\s*/,
    //   plus: /^\s*\+\s*/,
    //   minus: /^\s*-\s*/,
    // }),
    (this.editingLine = 0);
    this.codeEditorShown = true;
    this.autocomleteShown = false;
    // this.processes = [{
    //   name: 'Order product',
    //   url: 'Store',
    // }, ];
    // this.subprocesses = [];
    // this.selectedProcessIndex = 0;

    // modules.events.listen('transport:initiated', this.loadData.bind(this));
    // const processes = this.processes.map(p=>`<option value="${p.url}">${p.name}</option>`).join('');
    // this.elements.processesSelect.innerHTML = processes;
    // this.elements.processesSelect.addEventListener('change', e=>{this.fetchProcess(this.elements.processesSelect.selectedIndex)})
    // modules.events.listen('diagram.header.change', e => this.elements.diagramHeader.innerText = e);
    modules.events.listen(
      'diagram-paper:scale:change',
      (e) => (this.elements.scale.innerText = e.toFixed(1))
    );

    this.diagram = new flowDiagram('diagram-paper', modules);
    this.popupDiagram = new flowDiagram('flow-diagram-popup-paper', modules);

    this.modules.events.listen(
      'diagram-paper:group:toggle',
      this.diagramShowEmbeds.bind(this)
    );

    this.form = new form('form_component', modules);

    this.codeEditor = new codeEditor('diagram-code-editor', modules, this.view, {
      mode: 'markdown',
      value: '',
    });

    this.elements.openBtn.addEventListener('click', () =>
      this.showCodeEditor()
    );
    this.elements.closeBtn.addEventListener('click', () =>
      this.showCodeEditor(false)
    );

    this.modules.events.listen(
      'code:editor:change',
      (node) => {
        if (node.type == 'process') this.diagramCodeEditorChanged(node)
      }
    );

    // this.initCodeEditor();

    this.elements.processRunButton.addEventListener(
      'click',
      this.startFlow.bind(this)
    );
    this.modules.events.listen('console:form', this.form.show.bind(this.form));
    this.modules.events.listen(
      'console:notify',
      this.showNotification.bind(this)
    );
    this.showCodeEditor(false);
  }
  // loadData() {
  //   this.fetchProcess(this.selectedProcessIndex);
  // }

  async startFlow() {
    // const name = this.processes[this.selectedProcessIndex].url;

    const start = await this.modules.transport.send('startFlow', {
      name: 'Order product',
    });
    console.log(start);

    // const test = document.getElementById('test_component')
    // dialogs.open(test, {title:'Test title', buttons:[
    //   {text:'Custom', callback:()=>{
    //     this.test();
    //     dialogs.close();
    //   }}]
    // });
  }

  showNotification(data) {
    // this.modules.dialogs.alert(data.step, {title:'Notification'});
  }

  // async fetchProcess(index = 0) {
  //   // console.log(this)

  //   // console.log(index);
  //   this.selectedProcessIndex = index;

  //   //  this.processes[index].data = this.text;

  //   if (!this.processes[index].data) {
  //     const url = this.processes[index].url;
  //     try {
  //       const fetched = await this.modules.transport.send('getFlow', {
  //         name: url,
  //       });
  //       this.processes[index].data = fetched.source;
  //       // this.processes[index].data = '';
  //     } catch (e) {
  //       return console.error(e);
  //     }
  //   }
  //   // this.elements.diagramHeader.innerHTML = this.processes[index].name;
  //   this.codeEditor.setValue(this.processes[index].data);
  //   // this.elements.codeEditor.value = this.processes[index].data;

  //   // this.updateValue(this.processes[index].data);
  //   // console.log(this.processes[index].data);
  //   // this.updateValue(this.processes[index].data);
  //   // this.showCodeEditor(false);

  //   // console.log(parser.parseScript(this.text));
  // }

  diagramShowEmbeds(data) {
    // console.log(this.elements.popup)
    this.modules.dialogs.open(this.elements.popup, {
      title: data.name,
      cancel: false,
    });
    this.popupDiagram.updateGraph([data]);

    // this.modules.dialogs.alert(
    //   '<ol class="flow-diagram-embeds-list">' +
    //     data.body
    //       .map((e) => `<li>${e.name.replaceAll('`', '')}</li>`)
    //       .join('') +
    //     '</ol>',
    //   { title: data.name, buttons: { ok: true } }
    // );
  }

  // updateValue(text) {
  //   console.log(
  //     text.length,
  //     this.processes[this.selectedProcessIndex].data.length
  //   );
  //   if (text == this.processes[this.selectedProcessIndex].data)
  //     this.elements.processSaveButton.setAttribute('disabled', true);
  //   else this.elements.processSaveButton.removeAttribute('disabled');

  //   const parsed = parser.parseProcess(text);
  //   // console.log(parsed)
  //   this.diagram.updateGraph(parsed);
  // }

  //.....CODE EDITOR

  showCodeEditor(show = true) {
    // if (!show)  this.showAutocomplete(false)
    this.codeEditorShown = show;
    this.elements.openBtn.style.display = show ? 'none' : 'block';
    this.elements.closeBtn.style.display = show ? 'block' : 'none';
    // this.elements.closeBtn.style.display = show ? 'block' : 'none';
    this.elements.codeEditor.style.display = show ? 'flex' : 'none';
    this.elements.codeEditorContainer.style.width = show ? '' : '0';
    this.elements.codeEditorDivider.style.width = show ? '' : '0';
    if (show) this.codeEditor.editor.refresh();
  }

  diagramCodeEditorChanged(node) {

    if (!node.original || typeof node.original.source != 'string') return console.error('No original node');
    const value = node.original.source;

    // console.log(value)

    let parsed = parser.parseProcess(value);
    this.diagram.updateGraph(parsed);

    // if (change.origin == 'setValue') {
    //   this.elements.processSaveButton.setAttribute('disabled', true);
    // } else {
    //   this.elements.processSaveButton.removeAttribute('disabled');
    //   const sameLine = change.from.line == change.to.line;
    //   if (change.origin == '+input') {} else if (change.origin == '+delete') {} else if (change.origin == 'paste') {}
    // }
  }
}

export default controllerDiagram;
