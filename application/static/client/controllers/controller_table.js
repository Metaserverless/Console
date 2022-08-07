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
      deleteButton: '<td style="width: 30px; padding: 0px;"><button class="entity-table-body_button">Delete</button></td>',
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
    
    this.crudJson = null
    this.modules.events.listen(
      'code:editor:change',
      (node) => {
        if (node.type == 'postgres' || node.type == 'redis') {
          this.сodeEditorChanged(node);
          this.crudJson = JSON.parse(node.original.source);
        }
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
    const header =
      '<tr>' +
      Object.keys(data.result[0])
      .map((key) => `<th>${key}</th>`)
      .join('') +
      '</tr>';
    this.elements.entityTableHeader.innerHTML = header;

    let body;
    if(this.crudJson[name].includes('delete')){
      body = this.isDelete(data.result);
    } else {
      body = data.result
      .map(
        (row) => `<tr>
                    ${Object.values(row).map((value) => `<td data-type="${typeof value}">${value}</td>`).join('')}
                  </tr>`
        ).join('');
    }
    this.elements.entityTableBody.innerHTML = body;
    this.isUpdate(name);
    this.isCreate(data.result,name);
  }

  isUpdate(name){
    if(this.crudJson[name].includes('update')){
      this.elements.entityTableBody.ondblclick = function(e) {
        if(e.target.tagName === "BUTTON") return;

        if(e.target.tagName === "INPUT"){
          const value = e.target.value;
          // here we need to make query that update row
          const type = e.target.getAttribute('type');
          e.path[1].outerHTML = `<td data-type="${type}">${value}</td>`;
          return;          
        }

        if(e.target.tagName === "TD"){
          const type = e.target.getAttribute('data-type');
          const text = e.target.textContent;
          const width = e.target.offsetWidth;
          e.target.outerHTML = `<td style="width: ${width}px; padding: 0px;">
                                  <input ${type === "number" ? "type='number'" : ""} value="${text}"></input>
                                </td> `;
        }
      };
    }
  }

  isCreate(rows, name) {
    if(this.crudJson[name].includes('create')){
      const maxId = Math.max(...rows.map(row => row[name.toLowerCase() + 'Id']));
      const ths = this.elements.entityTableHeader.firstChild.children;
      const lastTr = this.elements.entityTableBody.lastChild.children;
      
      const inputs = [];
      for(let i = 0; i < ths.length; i++){
        const type = lastTr[i].getAttribute('data-type')
        if(i === 0){
          inputs.push(`<td data-type="${type}" style="width: ${ths[i].offsetWidth}px;">${maxId + 1}</td>`);
          continue;
        }
        inputs.push(`<td style="width: ${ths[i].offsetWidth}px; padding: 0px;">
                       <input type="${type}"></input>
                     </td>`);
      }
      inputs.push(`<td style="width: 30px; padding: 0px;">
                     <button id="insert" class="entity-table-body_button">Insert</button>
                   </td>`);
      const tr = document.createElement('tr');
      tr.innerHTML = inputs.join('');
      this.elements.entityTableBody.append(tr);

      const insert = document.getElementById('insert');
      insert.addEventListener('click', (e) => {
        const amountTrs = this.elements.entityTableBody.children.length;
        const insertTr = this.elements.entityTableBody.children[amountTrs - 1];
        const tds = insertTr.children;
        
        // get input data
        const values = []; 
        for(let i = 0; i < tds.length - 1; i++){
          if(tds[i].children[0]){
            const type = tds[i].children[0].getAttribute('type');
            const value = tds[i].children[0].value;  
            values.push({type, value});
            continue;
          }
          const type = tds[i].getAttribute('data-type');
          const value = tds[i].textContent;
          values.push({type, value});
        }

        // insert new tr to table
        const newTr = document.createElement('tr');
        const newTds = values.map((value) => `<td data-type="${value.type}">${value.value}</td>`);
        if(this.crudJson[name].includes('delete')) newTds.push(this.elements.deleteButton);
        newTr.innerHTML = newTds.join('');
        // make insert query to data base
        this.elements.entityTableBody.insertBefore(newTr, insertTr);

        // reset existing data
        for(let i = 1; i < tds.length - 1; i++){
          if(tds[i].children[0]){
            tds[i].children[0].value = '';
            continue;
          }
          const width = ths[i].offsetWidth;
          const type = tds[i].getAttribute('data-type');
          const newInput = `<td style="width: ${width}px; padding: 0px;"><input type="${type}" /></td>`;
          tds[i].outerHTML = newInput;
        }
        tds[0].innerHTML = +values[0].value + 1; 
      })
    }
  }

  isDelete(rows) {
    this.elements.entityTableBody.onclick = function(e) {
      if(e.target.tagName === 'BUTTON'){
        if(e.target.textContent === 'Delete'){
          if(confirm(`Delete row with Id ${e.path[2].children[0].textContent}?`)){
            // make delete query after confirm
            e.path[2].remove();
          }
        }
      }
    };
    return rows.map(
          (row) => `<tr>
                      ${Object.values(row).map((value) => `<td data-type="${typeof value}">${value}</td>`).join('')}
                      ${this.elements.deleteButton}
                    </tr>`
          ).join('');
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
