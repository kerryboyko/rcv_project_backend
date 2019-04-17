const droopQuota = (votes: number, seats: number): number =>
  Math.floor(votes / (seats + 1)) + 1;

export default droopQuota;
