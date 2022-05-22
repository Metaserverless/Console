async () => {
  domain.runtime.processes = {};
  domain.runtime.clients = new Map();
  domain.runtime.flows = new Map();

  const dirPath = './application/flow/';
  const files = await node.fsp.readdir(dirPath);
  for (const file of files) {
    const name = node.path.basename(file, '.md');
    await domain.runtime.load({ name });
  }

  const orderForm = application.schemas.model.entities.get('OrderForm');
  orderForm.fields.carrier = await db.pg.select('Carrier');
  orderForm.fields.product = await db.pg.select('Product');
};
