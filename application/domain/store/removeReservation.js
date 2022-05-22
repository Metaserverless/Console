async ({ reservation }) => {
  const { reservationId } = reservation;
  await db.pg.update('Reservation', { active: false }, { reservationId });
  return { ...reservation, active: false };
};
