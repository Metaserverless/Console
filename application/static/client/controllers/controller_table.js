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
      entityTableFooter: document.getElementById('entity-table-footer'),
      codeEditorContainer,
      codeEditor: codeEditorContainer.querySelector('.sliding-code-editor'),
      codeEditorDivider: codeEditorContainer.querySelector(
        '.sliding-code-editor-divider'
      ),
      closeBtn: codeEditorContainer.querySelector('.code-editor-close-button'),
      openBtn: codeEditorContainer.querySelector('.code-editor-open-button'),
      updateInput:document.getElementById('entity-table-update-input'),  
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

    this.crudJson = {};
    this.updatingObject = {};

    this.modules.events.listen(
      'code:editor:change',
      (node) => {
        // if (node.type == 'postgres' || node.type == 'redis') this.сodeEditorChanged(node)
        if (node.type == 'postgres' || node.type == 'redis') {
          this.сodeEditorChanged(node);
        }
      }
    );


   

    this.elements.updateInput.addEventListener('blur', this.updateRow.bind(this));

    this.elements.entitiesList.addEventListener('click', this.onEntityClick.bind(this));
    this.elements.entityTableBody.addEventListener('click', this.onEntityTableBodyClick.bind(this));
    this.elements.entityTableFooter.addEventListener('click', this.onEntityTableFooterClick.bind(this));
    this.elements.entityTableBody.addEventListener('dblclick', this.onEntityTableBodyDoubleClick.bind(this));

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

  onEntityTableBodyClick(event) {
      if(event.target.tagName === 'BUTTON' && event.target.textContent === 'Delete') {
        
          this.deleteRow(event.path[2].children[0].innerText, event.path[2]);
        
       
      }
  }
  onEntityTableFooterClick(event) {
      if(event.target.tagName === 'BUTTON' && event.target.textContent === 'Insert') {
          this.insertRow(); 
      }
  }

  onEntityTableBodyDoubleClick(event) {
    if(!this.crudJson[this.selected].includes('update') || !event.target.tagName === 'TD') return;
    const td = event.target, input = this.elements.updateInput;
    // console.log(td.parentNode.children[0], td.parentNode.children[0].innerText)
    if (td.parentNode.firstChild == td) return;

    this.updatingObject = {
      selected:this.selected, 
      el:td, 
      id:td.parentNode.children[0].innerText, 
      field:td.getAttribute('data-field'), 
      type:td.getAttribute('data-type'), 
      value:td.textContent
    };
   
    input.value = this.updatingObject.value;
    td.textContent = '';
    td.style.padding = 0;
    input.remove();
    td.appendChild(input);
    input.setAttribute('type', this.updatingObject.type);
    input.classList.remove('display-none');
    input.focus();
  }

  async select(name) {
    if (name == this.selected) return;
    this.selected = name;
    const divs = this.elements.entitiesList.querySelectorAll('div');
    for (let div of divs) {
      if (div.innerHTML == name) div.classList.add('active');
      else div.classList.remove('active');
    }
    this.elements.entityTableHeader.innerHTML = '';
    this.elements.entityTableBody.innerHTML = '';
    this.elements.entityTableFooter.innerHTML = '';

    const data = await this.callServer('select');
    if (!data || !data.result || !data.result.length) {
        this.elements.entityTableHeader.innerHTML = '<tr><td>No data</td></tr>';
        return;
    }
    const rows = data.result;
   
    const firstRow = rows[0];
    const isDeletable = this.crudJson[name].includes('delete');
    const isInsertable = this.crudJson[name].includes('create');

    const header =
      '<tr>' +
      Object.keys(firstRow)
      .map((key) => `<th>${key}</th>`)
      .join('') +
      (isDeletable  || isInsertable ? '<th></th>' : '') +
      '</tr>';


    this.elements.entityTableHeader.innerHTML = header;

    let body =  rows
        .map((row) => `<tr>
            ${Object.keys(row).map((key, index) => {
              const type = typeof row[key] == 'number' ? 'number' : 'text';
              return `<td data-field="${key}" data-type="${type}">${row[key]}</td>`
            }).join('') + 
            (isDeletable ? '<td class="entity-table-body-button-delete-td"><button>Delete</button></td>' : isInsertable ? '<td></td>' : '')}
          </tr>`
      ).join('');
  
      this.elements.entityTableBody.innerHTML = body;
           
    let footer = '';
   
    if(isInsertable) {
      footer = '<tr class="entity-table-body-row-insert">' +
      Object.keys(firstRow).map((key, index) => {
        const type = typeof firstRow[key] == 'number' ? 'number' : 'text';
        return `<td data-field="${key}" data-type="${type}"><input type="${type}"></input></td>`
      })
      .join('') + 
      `<td class="entity-table-body-button-insert-td"><button>Insert</button></td>
      </tr>`;

    }
    

    this.elements.entityTableFooter.innerHTML = footer;
    
  }

  async insertRow(){
      const inputsRow = this.elements.entityTableFooter.firstChild;
      if (!inputsRow) return;
      const data = {}, tds = inputsRow.children, cells = [];
      const isDeletable = this.crudJson[this.selected].includes('delete');
      const isInsertable = this.crudJson[this.selected].includes('create');
      
      for(let i = 0; i < tds.length - 1; i++){
        if (!tds[i].children.length || tds[i].children[0].tagName != 'INPUT') continue;
        data[tds[i].getAttribute('data-field')] = tds[i].children[0].value;
        cells.push(`<td data-field="${tds[i].getAttribute('data-field')}" data-type="${tds[i].children[0].getAttribute('data-type')}">${tds[i].children[0].value}</td>`);
        tds[i].children[0].value = '';
      }
      if (isDeletable) cells.push('<td class="entity-table-body-button-delete-td"><button>Delete</button></td>');
      else if (isInsertable) cells.push('<td></td>');

      const insert = await this.callServer('create', data);
      console.log(insert);
//      {
//     "command": "INSERT",
//     "rowCount": 1,
//     "oid": 0,
//     "rows": [],
//     "fields": [],
//     "_types": {
//         "_types": {
//             "arrayParser": {},
//             "builtins": {
//                 "BOOL": 16,
//                 "BYTEA": 17,
//                 "CHAR": 18,
//                 "INT8": 20,
//                 "INT2": 21,
//                 "INT4": 23,
//                 "REGPROC": 24,
//                 "TEXT": 25,
//                 "OID": 26,
//                 "TID": 27,
//                 "XID": 28,
//                 "CID": 29,
//                 "JSON": 114,
//                 "XML": 142,
//                 "PG_NODE_TREE": 194,
//                 "SMGR": 210,
//                 "PATH": 602,
//                 "POLYGON": 604,
//                 "CIDR": 650,
//                 "FLOAT4": 700,
//                 "FLOAT8": 701,
//                 "ABSTIME": 702,
//                 "RELTIME": 703,
//                 "TINTERVAL": 704,
//                 "CIRCLE": 718,
//                 "MACADDR8": 774,
//                 "MONEY": 790,
//                 "MACADDR": 829,
//                 "INET": 869,
//                 "ACLITEM": 1033,
//                 "BPCHAR": 1042,
//                 "VARCHAR": 1043,
//                 "DATE": 1082,
//                 "TIME": 1083,
//                 "TIMESTAMP": 1114,
//                 "TIMESTAMPTZ": 1184,
//                 "INTERVAL": 1186,
//                 "TIMETZ": 1266,
//                 "BIT": 1560,
//                 "VARBIT": 1562,
//                 "NUMERIC": 1700,
//                 "REFCURSOR": 1790,
//                 "REGPROCEDURE": 2202,
//                 "REGOPER": 2203,
//                 "REGOPERATOR": 2204,
//                 "REGCLASS": 2205,
//                 "REGTYPE": 2206,
//                 "UUID": 2950,
//                 "TXID_SNAPSHOT": 2970,
//                 "PG_LSN": 3220,
//                 "PG_NDISTINCT": 3361,
//                 "PG_DEPENDENCIES": 3402,
//                 "TSVECTOR": 3614,
//                 "TSQUERY": 3615,
//                 "GTSVECTOR": 3642,
//                 "REGCONFIG": 3734,
//                 "REGDICTIONARY": 3769,
//                 "JSONB": 3802,
//                 "REGNAMESPACE": 4089,
//                 "REGROLE": 4096
//             }
//         },
//         "text": {},
//         "binary": {}
//     },
//     "RowCtor": null,
//     "rowAsArray": false
// }

      // console.log(data);
      const tr = document.createElement('tr');
      tr.innerHTML = cells.join('');
      this.elements.entityTableBody.appendChild(tr);
  }

  async updateRow(){
    // console.log(this.elements.updateInput.value)
    if (this.selected != this.updatingObject.selected || typeof this.updatingObject.id === 'undefined') return;

    const td = this.updatingObject.el, input = this.elements.updateInput;
    if (input.value != this.updatingObject.value) {
      const update = await this.callServer('update', {id:this.updatingObject.id, [this.updatingObject.field]:input.value});
      // console.log(update);
      console.log(this.updatingObject, update);
    }

    input.classList.add('display-none');
    td.style.padding = '';
    td.textContent = input.value;
    input.value = '';
    this.updatingObject = {};
  }

  async deleteRow(id, row){
 // if(confirm(`Delete row with Id ${e.path[2].children[0].textContent}?`)){
      // console.log(id, row);
      const data = await this.callServer('delete', {id}); 
      console.log(data)    
      // if (data) row.remove();
            // }
  }

  async callServer(operation = 'select', dataObject = {}){
    if (!this.selected) return;
    const method = operation + this.selected;
    const idField = this.selected.toLowerCase() + 'Id';
     const store = this.modules.transport.endpoint['store'];

    const record = {}, delta = {}, conditions = {};
    // let data;
    let object = {};
    switch (operation) {
      case 'select':
        conditions[idField] = '>0';
        object = conditions;
        break;
      case 'create': 
        for (let id in dataObject) {
          if (id != idField) record[id] = dataObject[id];
        }
        object = record;
      break;
      case 'update': 
        for (let id in dataObject) {
          if (id != 'id') delta[id] = dataObject[id];
        }
        conditions[idField] = dataObject.id;
        object = {delta, conditions};
      break;
      case 'delete': 
        conditions[idField] = dataObject.id;
        object = conditions;
      break;
    }
    


     const data = await this.modules.transport.send(method, object, 'store');
    //  console.log(method, object);
    // const data = await store[method](object);

    if (!data) return console.error('no data');
    return data;
  }

  
  
  clearScreen(){
    this.elements.entitiesList.innerHTML = '';
    this.elements.entityTableHeader.innerHTML  = '<tr><td>No data</td></tr>';
    this.elements.entityTableBody.innerHTML = '';
    this.elements.entityTableFooter.innerHTML = '';
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
   
    try {

      this.entities = this.crudJson = JSON.parse(value);
      const entitiesHTML = Object.keys(this.entities)
        .map((key) => `<div>${key}</div>`)
        .join('');
      this.elements.entitiesList.innerHTML = entitiesHTML;
    }
    catch (e){
      this.selected = '';
      this.crudJson = {};
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
