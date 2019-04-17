const droopQuota = (votes: number, seats: number): number => {
  const droop = Math.floor(votes / (seats + 1)) + 1;
  console.log(droop);
  return droop;
};

export default droopQuota;
