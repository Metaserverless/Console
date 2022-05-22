async ({ order }) => {
  const { orderId, amount, productId } = order;
  const product = await db.pg.row('Product', ['*'], { productId });
  const { weight } = product;
  const postPackage = {
    orderId,
    weight: weight * amount,
  };
  const { rows } = await db.pg
    .insert('Package', postPackage)
    .returning('packageId');
  const { packageId } = rows[0];
  return { ...postPackage, packageId };
};
