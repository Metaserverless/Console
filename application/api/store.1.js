({
  plugin: 'metasql/crud',
  database: db.pg,
  entities: {
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
  },
});
