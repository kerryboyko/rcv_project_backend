import Tallier from './Tallier';

import { genPrimary } from './genElections';
const test = genPrimary();
const data: any = {};
data.stv = new Tallier(test, 3);
data.irv = new Tallier(test, 1);

describe('class Tallier', () => {
  it('constructor()', () => {
    expect(data.stv.ballots).toEqual([
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
    expect(data.stv.quota).toBe(2201);
  });
});

describe('correctly works with a larger data set', () => {
  it('works for IRV', async () => {
    data.irv.tally();
    const { quota, winners, reports } = data.irv;
    expect(quota).toBe(4401);
    expect(Array.from(winners.entries())).toEqual([['GAMMA', 1]]);
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
  it('works for STV', async () => {
    data.stv.tally();
    const { quota, winners, reports } = data.stv;
    expect(quota).toBe(2201);
    expect(Array.from(winners.entries())).toEqual([
      ['GAMMA', 1],
      ['DELTA', 1],
      ['ALPHA', 1],
    ]);
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
            candidate: 'GAMMA',
            action: 'ELECTED - MET QUOTA',
            seats: 1,
            round: 1,
            votesTransferred: 619,
            changes: {
              ALPHA: 100.9716312056737,
              BETA: 210.7234042553191,
              DELTA: 201.9432624113474,
              EPSILON: 105.36170212765956,
              ZETA: 0,
            },
          },
        ],
      },
      {
        round: 2,
        results: {
          ALPHA: 1740.9716312056737,
          BETA: 1530.723404255319,
          DELTA: 1841.9432624113474,
          EPSILON: 545.3617021276596,
          ZETA: 940,
        },
        outcome: [
          {
            candidate: 'EPSILON',
            action: 'ELIMINATED - FEWEST VOTES',
            seats: 0,
            round: 2,
            votesTransferred: 545.3617021276596,
            changes: { ALPHA: 0, BETA: 0, DELTA: 545.3617021276596, ZETA: 0 },
          },
        ],
      },
      {
        round: 3,
        results: {
          ALPHA: 1740.9716312056737,
          BETA: 1530.723404255319,
          DELTA: 2387.304964539007,
          ZETA: 940,
        },
        outcome: [
          {
            candidate: 'DELTA',
            action: 'ELECTED - MET QUOTA',
            seats: 1,
            round: 3,
            votesTransferred: 186.30496453900696,
            changes: { ALPHA: 0, BETA: 71.87250462001066, ZETA: 0 },
          },
        ],
      },
      {
        round: 4,
        results: {
          ALPHA: 1740.9716312056737,
          BETA: 1602.5959088753298,
          ZETA: 940,
        },
        outcome: [
          {
            candidate: 'ZETA',
            action: 'ELIMINATED - FEWEST VOTES',
            seats: 0,
            round: 4,
            votesTransferred: 940,
            changes: { ALPHA: 459.9999999999998, BETA: 480 },
          },
        ],
      },
      {
        round: 5,
        results: { ALPHA: 2200.9716312056735, BETA: 2082.5959088753298 },
        outcome: [
          {
            candidate: 'BETA',
            action: 'ELIMINATED - FEWEST VOTES',
            seats: 0,
            round: 5,
            votesTransferred: 2082.5959088753298,
            changes: { ALPHA: 1465.3617021276596 },
          },
        ],
      },
      {
        round: 6,
        results: { ALPHA: 3666.333333333333 },
        outcome: [
          {
            candidate: 'ALPHA',
            action: 'ELECTED - OTHER CANDIDATES ELIMINATED',
            seats: 1,
            round: 6,
            votesTransferred: 0,
          },
        ],
      },
    ]);
  });
});
