async ({ order }) => {
  const { productId } = order;
  const amount = await db.pg.scalar('Product', ['amount'], { productId });
  return { amount };
};
