async ({ order, paymentForm }) => {
  const { amount } = paymentForm;
  const payment = {
    orderId: order.orderId,
    amount,
    transaction: 'replace',
  };
  const { rows } = await db.pg
    .insert('Payment', payment)
    .returning('paymentId');
  console.log({ PAY: rows });
  const { paymentId } = rows[0];
  const record = await db.pg.row('Payment', ['*'], { paymentId });
  return record;
};
