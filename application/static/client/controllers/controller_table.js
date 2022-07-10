/* eslint-disable */
import codeEditor from '../editors/baseCodeEditor.js';

class controllerTable {
  constructor(id, modules) {
    this.modules = modules;
    this.view = 'Table';

    const codeEditorContainer = document.getElementById(
      'table-code-editor-container'
    );

    this.elements = {
      entitiesList: document.getElementById('entities-list'),
      entityTable: document.getElementById('entity-table'),
      entityTableHeader: document.getElementById('entity-table-header'),
      entityTableBody: document.getElementById('entity-table-body'),
      codeEditorContainer,
      codeEditor: codeEditorContainer.querySelector('.sliding-code-editor'),
      codeEditorDivider: codeEditorContainer.querySelector(
        '.sliding-code-editor-divider'
      ),
      closeBtn: codeEditorContainer.querySelector('.code-editor-close-button'),
      openBtn: codeEditorContainer.querySelector('.code-editor-open-button'),
    };

    this.codeEditor = new codeEditor('table-code-editor', modules, this.view, {
      mode: 'application/ld+json',
      value: '',
    });

    this.codeEditorShown = true;

    this.elements.openBtn.addEventListener('click', () =>
      this.showCodeEditor()
    );
    this.elements.closeBtn.addEventListener('click', () =>
      this.showCodeEditor(false)
    );

    this.modules.events.listen(
      'code:editor:change',
      (node) => {
        if (node.type == 'postgres' || node.type == 'redis') this.сodeEditorChanged(node)
      }
    );



    this.elements.entitiesList.addEventListener(
      'click',
      this.onEntityClick.bind(this)
    );

    this.showCodeEditor(false);
  }

  onEntityClick(event) {
    const name = event.target.innerHTML;
    this.select(name);
    // console.log(event.target)
    // this.elements.entityTableHeader.innerHTML = entity;
    // this.elements.entityTableBody.innerHTML = '';
    // this.elements.entityTable.classList.add('active');
  }

  async select(name) {
    if (name == this.selected) return;
    this.selected = name;
    const divs = this.elements.entitiesList.querySelectorAll('div');
    for (let div of divs) {
      if (div.innerHTML == name) div.classList.add('active');
      else div.classList.remove('active');
    }
    const method = 'select' + name;
    const id = name.toLowerCase() + 'Id';
    this.elements.entityTableHeader.innerHTML = '';
    this.elements.entityTableBody.innerHTML = '';
    const data = await this.modules.transport.send(
      method, {
        [id]: '>0'
      },
      'store'
    );
    if (!data || !data.result) return console.error('no data', data);
    if (!data.result.length) {
      this.elements.entityTableHeader.innerHTML = '<tr><td>No data</td></tr>';
      return;
    }
    // // const table = data.result.map(row => `<div>${row.id}</div>`).join('');
    const header =
      '<tr>' +
      Object.keys(data.result[0])
      .map((key) => `<th>${key}</th>`)
      .join('') +
      '</tr>';
    this.elements.entityTableHeader.innerHTML = header;
    const body = data.result
      .map(
        (row) =>
        `<tr>${Object.values(row)
            .map((value) => `<td>${value}</td>`)
            .join('')}</tr>`
      )
      .join('');
    this.elements.entityTableBody.innerHTML = body;
  }

  clearScreen(){
    this.elements.entitiesList.innerHTML = '';
    this.elements.entityTableHeader.innerHTML  = '<tr><td>No data</td></tr>';
    this.elements.entityTableBody.innerHTML = '';
  }

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

  сodeEditorChanged(node) {

    if (!node.original || typeof node.original.source != 'string') return console.error('No original node');
    const value = node.original.source;
    this.selected = '';
    this.clearScreen();
    // console.log(value);
    let json = {};
    try {

      json = JSON.parse(value);
      // console.log(json)

      this.entities = json;


      const entities = Object.keys(this.entities)
        .map((key) => `<div>${key}</div>`)
        .join('');
      this.elements.entitiesList.innerHTML = entities;
    }
    catch (e){
      this.elements.entityTableHeader.innerHTML  = '<tr><td>Malformed JSON</td></tr>';
      // console.error(e)
    }

    // console.log(value)

    // let parsed = parser.parseProcess(value);
    // this.diagram.updateGraph(parsed);

    // if (change.origin == 'setValue') {
    //   this.elements.processSaveButton.setAttribute('disabled', true);
    // } else {
    //   this.elements.processSaveButton.removeAttribute('disabled');
    //   const sameLine = change.from.line == change.to.line;
    //   if (change.origin == '+input') {} else if (change.origin == '+delete') {} else if (change.origin == 'paste') {}
    // }
  }
}

export default controllerTable;
