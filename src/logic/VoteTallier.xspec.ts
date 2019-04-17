import VoteTallier from './VoteTallier';
import { ElectionType, VoteRecord } from '../types';
import Ballot from './Ballot';
import { genPrimary, genVotes } from './genElections';

const sample: VoteRecord = genVotes();
const data: any = {};

describe('genVotes', () => {
  it('has the right lengths', () => {
    for (const vote of sample) {
      expect(vote).toHaveLength(3);
    }
    expect(sample).toHaveLength(220);
  });
});

describe('class VoteTallier', () => {
  describe('VoteTallier.constructor()', () => {
    it('constructs a basic instant runoff vote', () => {
      data.test1 = new VoteTallier({ votes: sample });
      const results1 = data.test1.debug();
      expect(
        results1.ballots.map((ballot: Ballot): string[] => ballot.votingPrefs)
      ).toEqual(sample);
      expect(results1.seats).toEqual(1);
      expect(results1.quota).toEqual(111);
    });
    it('constructs a multiseat vote', () => {
      data.test2 = new VoteTallier({
        votes: sample,
        electionType: ElectionType.MultiSeat,
        seats: 2,
      });
      const results2 = data.test2.debug();
      expect(
        results2.ballots.map((ballot: Ballot): string[] => ballot.votingPrefs)
      ).toEqual(sample);
      expect(results2.seats).toEqual(2);
      expect(results2.quota).toEqual(74);
    });
  });
  describe('VoteTallier.getInitialReport', () => {
    it('calculates the value of a round', () => {
      const round = data.test1.getInitialReport();
      data.expected = {
        round: 1,
        results: {
          ALPHA: 82,
          BETA: 44,
          GAMMA: 94,
        },
      };
      expect(round).toEqual(data.expected);
    });
  });
  describe('VoteTallier.tallyVotes()', () => {
    it('correctly tallies Instant Runoff', async () => {
      data.test1.tallyVotes();
      const { reports } = data.test1.debug();
      expect(reports).toEqual([
        {
          round: 1,
          results: { ALPHA: 82, BETA: 44, GAMMA: 94 },
          outcome: {
            candidate: 'BETA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 44,
            round: 1,
            seats: 0,
          },
        },
        {
          round: 2,
          results: { ALPHA: 126, GAMMA: 94 },
          outcome: {
            candidate: 'ALPHA',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 1,
            votesTransferred: 15,
          },
        },
        { round: 3, results: { GAMMA: 108.99999999999996 } },
      ]);
    });
    it('correctly tallies STV', async () => {
      data.test2.tallyVotes();
      const { reports } = data.test2.debug();

      expect(reports).toEqual([
        {
          round: 1,
          results: { ALPHA: 82, BETA: 44, GAMMA: 94 },
          outcome: {
            candidate: 'GAMMA',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 1,
            votesTransferred: 20,
          },
        },
        {
          round: 2,
          results: { ALPHA: 91.78723404255305, BETA: 54.21276595744666 },
          outcome: {
            candidate: 'ALPHA',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 1,
            votesTransferred: 17.787234042553052,
          },
        },
        { round: 3, results: { BETA: 71.99999999999967 } },
      ]);
    });
  });
  describe('correctly works with a larger data set', () => {
    data.bigIRV = new VoteTallier({ votes: genPrimary() });
    data.bigSTV = new VoteTallier({
      votes: genPrimary(),
      electionType: ElectionType.MultiSeat,
      seats: 3,
    });
    it('works for IRV', async () => {
      data.bigIRV.tallyVotes();
      const { reports } = data.bigIRV.debug();

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
          outcome: {
            candidate: 'EPSILON',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 440,
            round: 1,
            seats: 0,
          },
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
          outcome: {
            candidate: 'ZETA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 940,
            round: 2,
            seats: 0,
          },
        },
        {
          round: 3,
          results: { ALPHA: 2100, BETA: 1800, GAMMA: 2820, DELTA: 2080 },
          outcome: {
            candidate: 'BETA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 1800,
            round: 3,
            seats: 0,
          },
        },
        {
          round: 4,
          results: { ALPHA: 3460, GAMMA: 2820, DELTA: 2520 },
          outcome: {
            candidate: 'DELTA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 2520,
            round: 4,
            seats: 0,
          },
        },
        {
          round: 5,
          results: { ALPHA: 3460, GAMMA: 5340 },
          outcome: {
            candidate: 'GAMMA',
            action: 'ELECTED - MET QUOTA',
            round: 5,
            seats: 1,
            votesTransferred: 939,
          },
        },
        { round: 6, results: { ALPHA: 3625.292134831411 } },
      ]);
    });
    it('works for STV', () => {
      data.bigSTV.tallyVotes();
      const { reports } = data.bigSTV.debug();

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
          outcome: {
            candidate: 'GAMMA',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 1,
            votesTransferred: 619,
          },
        },
        {
          round: 2,
          results: {
            ALPHA: 1740.9716312056798,
            BETA: 1530.7234042553318,
            DELTA: 1841.9432624113597,
            EPSILON: 545.3617021276659,
            ZETA: 940,
          },
          outcome: {
            candidate: 'EPSILON',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 545.3617021276659,
            round: 2,
            seats: 0,
          },
        },
        {
          round: 3,
          results: {
            ALPHA: 1740.9716312056798,
            BETA: 1530.7234042553318,
            DELTA: 2387.304964538812,
            ZETA: 940,
          },
          outcome: {
            candidate: 'DELTA',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 1,
            votesTransferred: 186.30496453881187,
          },
        },
        {
          round: 4,
          results: {
            ALPHA: 1740.9716312056798,
            BETA: 1602.595908875287,
            ZETA: 940,
          },
          outcome: {
            candidate: 'ZETA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 940,
            round: 4,
            seats: 0,
          },
        },
        {
          round: 5,
          results: { ALPHA: 2200.97163120568, BETA: 2082.595908875287 },
          outcome: {
            candidate: 'BETA',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 2082.595908875287,
            round: 5,
            seats: 0,
          },
        },
        {
          round: 6,
          results: { ALPHA: 3666.3333333333458 },
          outcome: {
            candidate: 'ALPHA',
            action: 'ELECTED - OTHER CANDIDATES ELIMINATED',
            round: 6,
            seats: 1,
            votesTransferred: 0,
          },
        },
        { round: 7, results: {} },
      ]);
    });
  });
});
