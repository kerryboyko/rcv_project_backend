import DemTallier from './DemTallier';

import { genPrimary } from './genElections';
const test = genPrimary();
const data: any = {};
data.dem = new DemTallier(test);

describe('/src/logic/DemTallier', () => {
  describe('class DemTallier', () => {
    describe('constructor()', () => {
      it('constructs', () => {
        expect(data.dem.thresh).toBe(1320);
        expect(data.dem.ballots).toEqual([
          [['ALPHA', 'BETA', 'GAMMA'], 400],
          [['ALPHA', 'GAMMA', 'BETA'], 420],
          [['BETA', 'ALPHA', 'GAMMA'], 440],
          [['GAMMA', 'ALPHA', 'BETA'], 460],
          [['GAMMA', 'BETA', 'ALPHA'], 480],
          [['DELTA', 'BETA', 'GAMMA'], 400],
          [['DELTA', 'GAMMA', 'BETA'], 420],
          [['BETA', 'DELTA', 'GAMMA'], 440],
          [['GAMMA', 'DELTA', 'BETA'], 460],
          [['GAMMA', 'BETA', 'DELTA'], 480],
          [['DELTA', 'EPSILON', 'GAMMA'], 400],
          [['DELTA', 'GAMMA', 'EPSILON'], 420],
          [['EPSILON', 'DELTA', 'GAMMA'], 440],
          [['GAMMA', 'DELTA', 'EPSILON'], 460],
          [['GAMMA', 'EPSILON', 'DELTA'], 480],
          [['ALPHA', 'EPSILON', 'GAMMA'], 400],
          [['ALPHA', 'ZETA', 'BETA'], 420],
          [['BETA', 'ALPHA', 'ZETA'], 440],
          [['ZETA', 'ALPHA', 'BETA'], 460],
          [['ZETA', 'BETA', 'ALPHA'], 480],
        ]);
      });
    });
    describe('DemTallier.tally()', () => {
      it('returns a jefferson tally', () => {
        const tally = data.dem.tally();
        expect(tally).toEqual({
          ALPHA: { seatsAllocated: 6, votes: 2100 },
          BETA: { seatsAllocated: 5, votes: 1800 },
          GAMMA: { seatsAllocated: 8, votes: 2820 },
          DELTA: { seatsAllocated: 5, votes: 2080 },
        });

        expect(data.dem.reports).toEqual([
          {
            round: 1,
            results: {
              ALPHA: 1640,
              BETA: 1320,
              GAMMA: 2820,
              DELTA: 1640,
              EPSILON: 440,
              ZETA: 940,
            },
            outcome: [
              {
                candidate: 'EPSILON',
                action: 'ELIMINATED - FEWEST VOTES',
                seats: 0,
                round: 1,
                votesTransferred: 440,
                changes: { ALPHA: 0, BETA: 0, GAMMA: 0, DELTA: 440, ZETA: 0 },
              },
            ],
          },
          {
            round: 2,
            results: {
              ALPHA: 1640,
              BETA: 1320,
              GAMMA: 2820,
              DELTA: 2080,
              ZETA: 940,
            },
            outcome: [
              {
                candidate: 'ZETA',
                action: 'ELIMINATED - FEWEST VOTES',
                seats: 0,
                round: 2,
                votesTransferred: 940,
                changes: { ALPHA: 460, BETA: 480, GAMMA: 0, DELTA: 0 },
              },
            ],
          },
          {
            round: 3,
            results: {
              ALPHA: { seatsAllocated: 0, votes: 2100 },
              BETA: { seatsAllocated: 0, votes: 1800 },
              GAMMA: { seatsAllocated: 1, votes: 2820 },
              DELTA: { seatsAllocated: 0, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 2100,
              BETA: 1800,
              GAMMA: 2820,
              DELTA: 2080,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 23,
              },
            ],
          },
          {
            round: 4,
            results: {
              ALPHA: { seatsAllocated: 1, votes: 2100 },
              BETA: { seatsAllocated: 0, votes: 1800 },
              GAMMA: { seatsAllocated: 1, votes: 2820 },
              DELTA: { seatsAllocated: 0, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 2100,
              BETA: 1800,
              GAMMA: 1410,
              DELTA: 2080,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 22,
              },
            ],
          },
          {
            round: 5,
            results: {
              ALPHA: { seatsAllocated: 1, votes: 2100 },
              BETA: { seatsAllocated: 0, votes: 1800 },
              GAMMA: { seatsAllocated: 1, votes: 2820 },
              DELTA: { seatsAllocated: 1, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 1050,
              BETA: 1800,
              GAMMA: 1410,
              DELTA: 2080,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 21,
              },
            ],
          },
          {
            round: 6,
            results: {
              ALPHA: { seatsAllocated: 1, votes: 2100 },
              BETA: { seatsAllocated: 1, votes: 1800 },
              GAMMA: { seatsAllocated: 1, votes: 2820 },
              DELTA: { seatsAllocated: 1, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 1050,
              BETA: 1800,
              GAMMA: 1410,
              DELTA: 1040,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 20,
              },
            ],
          },
          {
            round: 7,
            results: {
              ALPHA: { seatsAllocated: 1, votes: 2100 },
              BETA: { seatsAllocated: 1, votes: 1800 },
              GAMMA: { seatsAllocated: 2, votes: 2820 },
              DELTA: { seatsAllocated: 1, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 1050,
              BETA: 900,
              GAMMA: 1410,
              DELTA: 1040,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 19,
              },
            ],
          },
          {
            round: 8,
            results: {
              ALPHA: { seatsAllocated: 2, votes: 2100 },
              BETA: { seatsAllocated: 1, votes: 1800 },
              GAMMA: { seatsAllocated: 2, votes: 2820 },
              DELTA: { seatsAllocated: 1, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 1050,
              BETA: 900,
              GAMMA: 940,
              DELTA: 1040,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 18,
              },
            ],
          },
          {
            round: 9,
            results: {
              ALPHA: { seatsAllocated: 2, votes: 2100 },
              BETA: { seatsAllocated: 1, votes: 1800 },
              GAMMA: { seatsAllocated: 2, votes: 2820 },
              DELTA: { seatsAllocated: 2, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 700,
              BETA: 900,
              GAMMA: 940,
              DELTA: 1040,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 17,
              },
            ],
          },
          {
            round: 10,
            results: {
              ALPHA: { seatsAllocated: 2, votes: 2100 },
              BETA: { seatsAllocated: 1, votes: 1800 },
              GAMMA: { seatsAllocated: 3, votes: 2820 },
              DELTA: { seatsAllocated: 2, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 700,
              BETA: 900,
              GAMMA: 940,
              DELTA: 693.3333333333334,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 16,
              },
            ],
          },
          {
            round: 11,
            results: {
              ALPHA: { seatsAllocated: 2, votes: 2100 },
              BETA: { seatsAllocated: 2, votes: 1800 },
              GAMMA: { seatsAllocated: 3, votes: 2820 },
              DELTA: { seatsAllocated: 2, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 700,
              BETA: 900,
              GAMMA: 705,
              DELTA: 693.3333333333334,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 15,
              },
            ],
          },
          {
            round: 12,
            results: {
              ALPHA: { seatsAllocated: 2, votes: 2100 },
              BETA: { seatsAllocated: 2, votes: 1800 },
              GAMMA: { seatsAllocated: 4, votes: 2820 },
              DELTA: { seatsAllocated: 2, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 700,
              BETA: 600,
              GAMMA: 705,
              DELTA: 693.3333333333334,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 14,
              },
            ],
          },
          {
            round: 13,
            results: {
              ALPHA: { seatsAllocated: 3, votes: 2100 },
              BETA: { seatsAllocated: 2, votes: 1800 },
              GAMMA: { seatsAllocated: 4, votes: 2820 },
              DELTA: { seatsAllocated: 2, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 700,
              BETA: 600,
              GAMMA: 564,
              DELTA: 693.3333333333334,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 13,
              },
            ],
          },
          {
            round: 14,
            results: {
              ALPHA: { seatsAllocated: 3, votes: 2100 },
              BETA: { seatsAllocated: 2, votes: 1800 },
              GAMMA: { seatsAllocated: 4, votes: 2820 },
              DELTA: { seatsAllocated: 3, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 525,
              BETA: 600,
              GAMMA: 564,
              DELTA: 693.3333333333334,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 12,
              },
            ],
          },
          {
            round: 15,
            results: {
              ALPHA: { seatsAllocated: 3, votes: 2100 },
              BETA: { seatsAllocated: 3, votes: 1800 },
              GAMMA: { seatsAllocated: 4, votes: 2820 },
              DELTA: { seatsAllocated: 3, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 525,
              BETA: 600,
              GAMMA: 564,
              DELTA: 520,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 11,
              },
            ],
          },
          {
            round: 16,
            results: {
              ALPHA: { seatsAllocated: 3, votes: 2100 },
              BETA: { seatsAllocated: 3, votes: 1800 },
              GAMMA: { seatsAllocated: 5, votes: 2820 },
              DELTA: { seatsAllocated: 3, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 525,
              BETA: 450,
              GAMMA: 564,
              DELTA: 520,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 10,
              },
            ],
          },
          {
            round: 17,
            results: {
              ALPHA: { seatsAllocated: 4, votes: 2100 },
              BETA: { seatsAllocated: 3, votes: 1800 },
              GAMMA: { seatsAllocated: 5, votes: 2820 },
              DELTA: { seatsAllocated: 3, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 525,
              BETA: 450,
              GAMMA: 470,
              DELTA: 520,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 9,
              },
            ],
          },
          {
            round: 18,
            results: {
              ALPHA: { seatsAllocated: 4, votes: 2100 },
              BETA: { seatsAllocated: 3, votes: 1800 },
              GAMMA: { seatsAllocated: 5, votes: 2820 },
              DELTA: { seatsAllocated: 4, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 420,
              BETA: 450,
              GAMMA: 470,
              DELTA: 520,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 8,
              },
            ],
          },
          {
            round: 19,
            results: {
              ALPHA: { seatsAllocated: 4, votes: 2100 },
              BETA: { seatsAllocated: 3, votes: 1800 },
              GAMMA: { seatsAllocated: 6, votes: 2820 },
              DELTA: { seatsAllocated: 4, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 420,
              BETA: 450,
              GAMMA: 470,
              DELTA: 416,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 7,
              },
            ],
          },
          {
            round: 20,
            results: {
              ALPHA: { seatsAllocated: 4, votes: 2100 },
              BETA: { seatsAllocated: 4, votes: 1800 },
              GAMMA: { seatsAllocated: 6, votes: 2820 },
              DELTA: { seatsAllocated: 4, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 420,
              BETA: 450,
              GAMMA: 402.85714285714283,
              DELTA: 416,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 6,
              },
            ],
          },
          {
            round: 21,
            results: {
              ALPHA: { seatsAllocated: 5, votes: 2100 },
              BETA: { seatsAllocated: 4, votes: 1800 },
              GAMMA: { seatsAllocated: 6, votes: 2820 },
              DELTA: { seatsAllocated: 4, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 420,
              BETA: 360,
              GAMMA: 402.85714285714283,
              DELTA: 416,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 5,
              },
            ],
          },
          {
            round: 22,
            results: {
              ALPHA: { seatsAllocated: 5, votes: 2100 },
              BETA: { seatsAllocated: 4, votes: 1800 },
              GAMMA: { seatsAllocated: 6, votes: 2820 },
              DELTA: { seatsAllocated: 5, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 350,
              BETA: 360,
              GAMMA: 402.85714285714283,
              DELTA: 416,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 4,
              },
            ],
          },
          {
            round: 23,
            results: {
              ALPHA: { seatsAllocated: 5, votes: 2100 },
              BETA: { seatsAllocated: 4, votes: 1800 },
              GAMMA: { seatsAllocated: 7, votes: 2820 },
              DELTA: { seatsAllocated: 5, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 350,
              BETA: 360,
              GAMMA: 402.85714285714283,
              DELTA: 346.6666666666667,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 3,
              },
            ],
          },
          {
            round: 24,
            results: {
              ALPHA: { seatsAllocated: 5, votes: 2100 },
              BETA: { seatsAllocated: 5, votes: 1800 },
              GAMMA: { seatsAllocated: 7, votes: 2820 },
              DELTA: { seatsAllocated: 5, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 350,
              BETA: 360,
              GAMMA: 352.5,
              DELTA: 346.6666666666667,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 2,
              },
            ],
          },
          {
            round: 25,
            results: {
              ALPHA: { seatsAllocated: 5, votes: 2100 },
              BETA: { seatsAllocated: 5, votes: 1800 },
              GAMMA: { seatsAllocated: 8, votes: 2820 },
              DELTA: { seatsAllocated: 5, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 350,
              BETA: 300,
              GAMMA: 352.5,
              DELTA: 346.6666666666667,
            },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 1,
              },
            ],
          },
          {
            round: 26,
            results: {
              ALPHA: { seatsAllocated: 6, votes: 2100 },
              BETA: { seatsAllocated: 5, votes: 1800 },
              GAMMA: { seatsAllocated: 8, votes: 2820 },
              DELTA: { seatsAllocated: 5, votes: 2080 },
            },
            effectiveVotesForThisRound: {
              ALPHA: 350,
              BETA: 300,
              GAMMA: 313.3333333333333,
              DELTA: 346.6666666666667,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
                remainingDelegates: 0,
              },
            ],
          },
        ]);
      });
    });
  });
});
