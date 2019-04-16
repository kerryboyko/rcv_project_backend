import { range } from 'lodash';
import VoteTallier from './VoteTallier';
import { ElectionType, CandidateAction, VoteRecord } from '../types';
import Ballot from './Ballot';

const genVotes = (): VoteRecord => {
  const votes: string[][] = [];
  range(40).forEach(() => {
    votes.push(['ALPHA', 'BETA', 'GAMMA']);
  });
  range(42).forEach(() => {
    votes.push(['ALPHA', 'GAMMA', 'BETA']);
  });
  range(44).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'GAMMA']);
  });
  range(46).forEach(() => {
    votes.push(['GAMMA', 'ALPHA', 'BETA']);
  });
  range(48).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'ALPHA']);
  });
  return votes;
};

const genPrimary = (): VoteRecord => {
  const votes: string[][] = [];
  range(400).forEach(() => {
    votes.push(['ALPHA', 'BETA', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['ALPHA', 'GAMMA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'ALPHA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'ALPHA']);
  });
  range(400).forEach(() => {
    votes.push(['DELTA', 'BETA', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['DELTA', 'GAMMA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'DELTA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'DELTA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'BETA', 'DELTA']);
  });
  range(400).forEach(() => {
    votes.push(['DELTA', 'EPSILON', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['DELTA', 'GAMMA', 'EPSILON']);
  });
  range(440).forEach(() => {
    votes.push(['EPSILON', 'DELTA', 'GAMMA']);
  });
  range(460).forEach(() => {
    votes.push(['GAMMA', 'DELTA', 'EPSILON']);
  });
  range(480).forEach(() => {
    votes.push(['GAMMA', 'EPSILON', 'DELTA']);
  });
  range(400).forEach(() => {
    votes.push(['ALPHA', 'EPSILON', 'GAMMA']);
  });
  range(420).forEach(() => {
    votes.push(['ALPHA', 'ZETA', 'BETA']);
  });
  range(440).forEach(() => {
    votes.push(['BETA', 'ALPHA', 'ZETA']);
  });
  range(460).forEach(() => {
    votes.push(['ZETA', 'ALPHA', 'BETA']);
  });
  range(480).forEach(() => {
    votes.push(['ZETA', 'BETA', 'ALPHA']);
  });
  return votes;
};

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
        results1.ballots.map((ballot: Ballot): string[] => ballot.candidates)
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
        results2.ballots.map((ballot: Ballot): string[] => ballot.candidates)
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
    data.bigPrimary = new VoteTallier({
      votes: genPrimary(),
      electionType: ElectionType.DemocraticPrimary,
      seats: 24,
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
    it('works for a Primary', () => {
      const initialSeats = data.bigPrimary.debug().seats;
      data.bigPrimary.tallyVotes();
      const { reports } = data.bigPrimary.debug();
      const totalDelegatesAssigned = reports.reduce((pv: number, cv: any) => {
        if (!cv.outcome || cv.outcome.action === CandidateAction.eliminated) {
          return pv;
        }
        if (
          cv.outcome.action === CandidateAction.elected ||
          cv.outcome.action === CandidateAction.assigned
        ) {
          return pv + cv.outcome.seats;
        }
        return pv;
      }, 0);
      expect(totalDelegatesAssigned).toBe(initialSeats); // sanity check.

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
            seats: 7,
            votesTransferred: 349,
          },
        },
        {
          round: 2,
          results: {
            ALPHA: 1696.9290780141682,
            BETA: 1438.8085106382914,
            DELTA: 1753.8581560283365,
            EPSILON: 499.40425531915935,
            ZETA: 940,
          },
          outcome: {
            candidate: 'DELTA',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 4,
            votesTransferred: 341.85815602833645,
          },
        },
        {
          round: 3,
          results: {
            ALPHA: 1696.9290780141682,
            BETA: 1609.7375886525047,
            EPSILON: 670.3333333333111,
            ZETA: 940,
          },
          outcome: {
            candidate: 'ALPHA',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 4,
            votesTransferred: 284.9290780141682,
          },
        },
        {
          round: 4,
          results: {
            BETA: 1756.981570100909,
            EPSILON: 737.4967950727031,
            ZETA: 1010.5216348263618,
          },
          outcome: {
            candidate: 'BETA',
            action: 'ELECTED - MET QUOTA',
            round: 4,
            seats: 4,
            votesTransferred: 344.98157010090904,
          },
        },
        {
          round: 5,
          results: { EPSILON: 737.4967950727031, ZETA: 1096.9151937728473 },
          outcome: {
            candidate: 'ZETA',
            action: 'ELECTED - MET QUOTA',
            round: 5,
            seats: 3,
            votesTransferred: 37.91519377284726,
          },
        },
        {
          round: 6,
          results: { EPSILON: 737.4967950727031 },
          outcome: {
            candidate: 'EPSILON',
            action: 'ELECTED - MET QUOTA',
            round: 6,
            seats: 2,
            votesTransferred: 31.496795072703094,
          },
        },
        { round: 7, results: {} },
      ]);
    });
  });
});
