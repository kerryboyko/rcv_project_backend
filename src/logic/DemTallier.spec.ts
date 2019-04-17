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
    describe('public.threshTally', () => {
      it('finds the winners to pass the threshhold', () => {
        const winners = data.dem.threshTally();
        expect(winners.sort()).toEqual(
          ['ALPHA', 'BETA', 'GAMMA', 'DELTA'].sort()
        );
        expect(Array.from(data.dem.losers).sort()).toEqual(
          ['EPSILON', 'ZETA'].sort()
        );
        expect(data.dem.threshReports).toEqual([
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
                candidate: 'GAMMA',
                action: 'PASSED - PASSED THRESHOLD',
                seats: 0,
                round: 1,
                votesTransferred: 1500,
                changes: {
                  ALPHA: 244.68085106382978,
                  BETA: 510.63829787234044,
                  DELTA: 489.36170212765956,
                  EPSILON: 255.31914893617022,
                  ZETA: 0,
                },
              },
            ],
          },
          {
            round: 2,
            results: {
              ALPHA: 1884.6808510638298,
              BETA: 1830.6382978723404,
              DELTA: 2129.3617021276596,
              EPSILON: 695.3191489361702,
              ZETA: 940,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'PASSED - PASSED THRESHOLD',
                seats: 0,
                round: 2,
                votesTransferred: 809.3617021276596,
                changes: {
                  ALPHA: 0,
                  BETA: 404.6808510638298,
                  EPSILON: 404.6808510638298,
                  ZETA: 0,
                },
              },
            ],
          },
          {
            round: 3,
            results: {
              ALPHA: 1884.6808510638298,
              BETA: 2235.31914893617,
              EPSILON: 1100,
              ZETA: 940,
            },
            outcome: [
              {
                candidate: 'BETA',
                action: 'PASSED - PASSED THRESHOLD',
                seats: 0,
                round: 3,
                votesTransferred: 915.3191489361702,
                changes: {
                  ALPHA: 464.890822265696,
                  EPSILON: 0,
                  ZETA: 0,
                },
              },
            ],
          },
          {
            round: 4,
            results: {
              ALPHA: 2349.5716733295258,
              EPSILON: 1100,
              ZETA: 940,
            },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'PASSED - PASSED THRESHOLD',
                seats: 0,
                round: 4,
                votesTransferred: 1029.5716733295258,
                changes: {
                  EPSILON: 175.27818964050448,
                  ZETA: 262.9923607841324,
                },
              },
            ],
          },
          {
            round: 5,
            results: {
              EPSILON: 1275.2781896405045,
              ZETA: 1202.9923607841324,
            },
            outcome: [
              {
                candidate: 'ZETA',
                action: 'ELIMINATED - FAILED TO PASS THRESHOLD',
                seats: 0,
                round: 5,
                votesTransferred: 1202.9923607841324,
                changes: {
                  EPSILON: 0,
                },
              },
            ],
          },
          {
            round: 6,
            results: {
              EPSILON: 1275.2781896405045,
            },
            outcome: [
              {
                candidate: 'EPSILON',
                action: 'ELIMINATED - FAILED TO PASS THRESHOLD',
                seats: 0,
                round: 6,
                votesTransferred: 1275.2781896405045,
                changes: {},
              },
            ],
          },
        ]);
      });
    });
    describe('public resetVotesAfterThresh', () => {
      it('resets the votes after we find the delegates', () => {
        data.dem.resetVotesAfterThresh();
        expect(data.dem.wastedVotes).toBe(0);
        expect(data.dem.quota).toBe(353);
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
          [['DELTA', 'GAMMA'], 1260],
          [['GAMMA', 'DELTA'], 940],
          [['ALPHA', 'GAMMA'], 400],
          [['ALPHA', 'BETA'], 880],
          [['BETA', 'ALPHA'], 920],
        ]);
      });
    });
    describe('public tallyFinal()', () => {
      it('makes a final tally', () => {
        const end = data.dem.tallyFinal();
        expect(Array.from(end.entries())).toEqual([
          ['GAMMA', 7],
          ['DELTA', 6],
          ['ALPHA', 6],
          ['BETA', 5],
        ]);
        const { finalReports } = data.dem;
        expect(finalReports).toEqual([
          {
            round: 1,
            results: { ALPHA: 2100, BETA: 1800, GAMMA: 2820, DELTA: 2080 },
            outcome: [
              {
                candidate: 'GAMMA',
                action: 'ELECTED - MET QUOTA',
                seats: 7,
                round: 6,
                votesTransferred: 349,
                changes: {
                  ALPHA: 56.9290780141846,
                  BETA: 118.80851063829778,
                  DELTA: 173.26241134751763,
                },
              },
            ],
          },
          {
            round: 2,
            results: {
              ALPHA: 2156.9290780141846,
              BETA: 1918.8085106382978,
              DELTA: 2253.2624113475176,
            },
            outcome: [
              {
                candidate: 'DELTA',
                action: 'ELECTED - MET QUOTA',
                seats: 6,
                round: 6,
                votesTransferred: 135.26241134751763,
                changes: { ALPHA: 0, BETA: 52.641690144743734 },
              },
            ],
          },
          {
            round: 3,
            results: { ALPHA: 2156.9290780141846, BETA: 1971.4502007830415 },
            outcome: [
              {
                candidate: 'ALPHA',
                action: 'ELECTED - MET QUOTA',
                seats: 6,
                round: 6,
                votesTransferred: 38.9290780141846,
                changes: { BETA: 31.709725572605976 },
              },
            ],
          },
          {
            round: 4,
            results: { BETA: 2003.1599263556475 },
            outcome: [
              {
                candidate: 'BETA',
                action: 'ELECTED - OTHER CANDIDATES ELIMINATED',
                seats: 5,
                round: 4,
                votesTransferred: 0,
              },
            ],
          },
        ]);
      });
    });
  });
});
