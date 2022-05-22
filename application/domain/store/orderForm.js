async ({ orderForm }) => {
  const { amount } = orderForm;
  const order = {
    productId: 1,
    buyerId: 3, // account.,
    carrierId: 1,
    amount,
    total: amount * 20000,
    created: new Date(),
  };
  const { rows } = await db.pg.insert('Order', order).returning('orderId');
  const { orderId } = rows[0];
  const record = await db.pg.row('Order', ['*'], { orderId });
  return record;
};
