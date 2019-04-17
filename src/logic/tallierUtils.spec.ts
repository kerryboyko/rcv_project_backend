import {
  reduceIdenticalBallots,
  countCurrentPrefs,
  findLeader,
  findLagger,
  countValidBallots,
  calcDroopQuota,
} from './tallierUtils';
import { BallotTuple } from '../types';

import { genPrimary } from './genElections';

const test = genPrimary();
const data: any = {};
describe('/src/logic/tallierUtils.ts', () => {
  describe('reduceIdenticalBallots()', () => {
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
  describe('countCurrentPrefs()', () => {
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
});
