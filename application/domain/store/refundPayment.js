async ({ payment }) => {
  const { orderId, amount, transaction } = payment;
  const refund = { orderId, amount, transaction };
  await db.pg.insert('Refund', refund);
  return refund;
};
