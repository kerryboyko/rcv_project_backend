import { BallotTuple, IJeffersonTally } from '../types';

export const findLeader = (results: {
  [key: string]: number;
}): [string, number] =>
  Object.entries(results).reduce((pv: [string, number], cv: [string, number]) =>
    cv[1] > pv[1] ? cv : pv
  );

export const findLagger = (results: {
  [key: string]: number;
}): [string, number] =>
  Object.entries(results).reduce((pv: [string, number], cv: [string, number]) =>
    cv[1] < pv[1] ? cv : pv
  );

export const reduceIdenticalBallots = (
  ballots: BallotTuple[]
): BallotTuple[] => {
  const count = new Map();
  ballots
    .filter((bal: BallotTuple) => bal[0].length > 0)
    .forEach(([voteArray, weight]: BallotTuple) => {
      const stringified = JSON.stringify(voteArray);
      if (count.has(stringified)) {
        const [, oldWeight]: BallotTuple = count.get(stringified);
        count.set(stringified, [voteArray, weight + oldWeight]);
      } else {
        count.set(stringified, [voteArray, weight]);
      }
    });
  return Array.from(count.values());
};

export const countValidBallots = (ballots: BallotTuple[]): number =>
  ballots.reduce((pv, [, votes]: BallotTuple) => pv + votes, 0);

export const countCurrentPrefs = (ballots: BallotTuple[]): any => {
  const output: { [key: string]: number } = ballots
    .filter((bal: BallotTuple) => bal[0].length > 0)
    .reduce((pv: { [key: string]: number }, [vote, weight]: BallotTuple) => {
      if (!pv[vote[0]]) {
        pv[vote[0]] = 0;
      }
      pv[vote[0]] += weight;
      return pv;
    }, {});
  return output;
};

export const calcDroopQuota = (votes: number, seats: number): number =>
  Math.floor(votes / (seats + 1)) + 1;

export const countAllocations = (allo: IJeffersonTally): number =>
  Object.values(allo).reduce(
    (pv: number, { seatsAllocated }) => seatsAllocated + pv,
    0
  );
