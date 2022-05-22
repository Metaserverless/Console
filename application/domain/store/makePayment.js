async ({ order }) => {
  const { orderId, total } = order;
  const transaction = 'transaction id';
  const payment = { orderId, amount: total, transaction };
  await db.pg.insert('Payment', payment);
  return payment;
};
