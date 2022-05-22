async ({ order, balance, availability }) => {
  if (!availability.confirmed) {
    throw new Error('The product is out of stock');
  }

  const { productId } = order;

  const rest = balance.amount - order.amount;
  await db.pg.update('Product', { amount: rest }, { productId });

  const reservation = { productId, amount: order.amount, active: true };
  await db.pg.insert('Reservation', reservation);

  return reservation;
};
