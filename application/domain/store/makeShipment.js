async ({ package: postPackage, carrier }) => {
  const { packageId } = postPackage;
  const { carrierId } = carrier;
  const waybill = 'waybill number stub';
  const shipment = { packageId, carrierId, waybill };
  await db.pg.insert('Shipment', shipment);
  return shipment;
};
