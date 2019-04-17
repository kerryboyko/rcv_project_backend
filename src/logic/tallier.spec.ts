import Tallier, {
  BallotTuple,
  reduceIdenticalBallots,
  countCurrentPrefs,
  findLeader,
  findLagger,
  countValidBallots,
  calcDroopQuota,
} from './tallier';
import { genPrimary } from './genElections';
const test = genPrimary();
const data: any = {};
data.stv = new Tallier(test, 3);
data.irv = new Tallier(test, 1);
describe('tallier', () => {
  describe('reduceIdenticalBallots', () => {
    it('accurately reduces identical ballots', () => {
      expect(test.length).toBe(8800);
      data.reduced = reduceIdenticalBallots(
        test.map((entry: string[]): BallotTuple => [entry, 1])
      );
      expect(data.reduced.length).toBe(20);
      expect(data.reduced).toEqual([
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
  describe('countCurrentPrefs', () => {
    it('accurately counts current prefs', () => {
      data.counted = countCurrentPrefs(data.reduced);
      expect(data.counted).toEqual({
        ALPHA: 1640,
        BETA: 1320,
        DELTA: 1640,
        EPSILON: 440,
        GAMMA: 2820,
        ZETA: 940,
      });
    });
  });
  describe('findLeader()', () => {
    it('finds the leader', () => {
      expect(findLeader(data.counted)).toEqual(['GAMMA', 2820]);
    });
  });
  describe('findLagger()', () => {
    it('finds the lagger', () => {
      expect(findLagger(data.counted)).toEqual(['EPSILON', 440]);
    });
  });
  describe('calcDroopQuota()', () => {
    it('finds the lagger', () => {
      expect(calcDroopQuota(100, 4)).toEqual(21);
    });
  });
  describe('countValidBallots()', () => {
    it('counts the valid ballots', () => {
      expect(countValidBallots(data.reduced)).toBe(8800);
    });
  });
  describe('class Tallier', () => {
    it('constructor()', () => {
      expect(data.stv.ballots).toEqual(data.reduced);
      expect(data.stv.quota).toBe(2201);
    });
  });

  describe('correctly works with a larger data set', () => {
    it('works for IRV', async () => {
      data.irv.tally();
      const { quota, winners, reports } = data.irv;
      expect(quota).toBe(4401);
      expect(Array.from(winners.entries())).toEqual([['GAMMA', 1]]);
      console.log(JSON.stringify(reports));
      expect(reports).toEqual([
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
          results: { ALPHA: 2100, BETA: 1800, GAMMA: 2820, DELTA: 2080 },
          outcome: [
            {
              candidate: 'BETA',
              action: 'ELIMINATED - FEWEST VOTES',
              seats: 0,
              round: 3,
              votesTransferred: 1800,
              changes: { ALPHA: 1360, GAMMA: 0, DELTA: 440 },
            },
          ],
        },
        {
          round: 4,
          results: { ALPHA: 3460, GAMMA: 2820, DELTA: 2520 },
          outcome: [
            {
              candidate: 'DELTA',
              action: 'ELIMINATED - FEWEST VOTES',
              seats: 0,
              round: 4,
              votesTransferred: 2520,
              changes: { ALPHA: 0, GAMMA: 2520 },
            },
          ],
        },
        {
          round: 5,
          results: { ALPHA: 3460, GAMMA: 5340 },
          outcome: [
            {
              candidate: 'GAMMA',
              action: 'ELECTED - MET QUOTA',
              seats: 1,
              round: 5,
              votesTransferred: 939,
              changes: { ALPHA: 165.29213483146077 },
            },
          ],
        },
      ]);
    });
  });
});
