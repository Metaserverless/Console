/* eslint-disable */

class controllerTable {
  constructor(id, modules) {
    this.modules = modules;
    this.elements = {
      entitiesList: document.getElementById('entities-list'),
      entityTable: document.getElementById('entity-table'),
      entityTableHeader: document.getElementById('entity-table-header'),
      entityTableBody: document.getElementById('entity-table-body'),
    };
    this.entities = {
      Account: ['create', 'get', 'select', 'update'],
      Carrier: ['create', 'get', 'select', 'update', 'delete'],
      Product: ['create', 'get', 'select', 'update', 'delete'],
      Order: ['create', 'get', 'select'],
      Package: ['create', 'get', 'select'],
      Payment: ['create', 'get', 'select'],
      Refund: ['create', 'get', 'select'],
      Reservation: ['create', 'get', 'select'],
      Return: ['create', 'get', 'select'],
      Session: ['get', 'select'],
      Shipment: ['create', 'get', 'select'],
    };
    this.selected = '';

    const entities = Object.keys(this.entities)
      .map((key) => `<div>${key}</div>`)
      .join('');
    this.elements.entitiesList.innerHTML = entities;
    this.elements.entitiesList.addEventListener(
      'click',
      this.onEntityClick.bind(this)
    );
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
}

export default controllerTable;
