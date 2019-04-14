import { range } from 'lodash';
import VoteTallier from './VoteTallier';
import { ElectionType, CandidateAction, VoteRecord } from '../types';
import Ballot from './Ballot';

const genVotes = (): VoteRecord => {
  const votes: string[][] = [];
  range(40).forEach(() => {
    votes.push(['a', 'b', 'c']);
  });
  range(42).forEach(() => {
    votes.push(['a', 'c', 'b']);
  });
  range(44).forEach(() => {
    votes.push(['b', 'a', 'c']);
  });
  range(46).forEach(() => {
    votes.push(['c', 'a', 'b']);
  });
  range(48).forEach(() => {
    votes.push(['c', 'b', 'a']);
  });
  return votes;
};

const genPrimary = (): VoteRecord => {
  const votes: string[][] = [];
  range(400).forEach(() => {
    votes.push(['a', 'b', 'c']);
  });
  range(420).forEach(() => {
    votes.push(['a', 'c', 'b']);
  });
  range(440).forEach(() => {
    votes.push(['b', 'a', 'c']);
  });
  range(460).forEach(() => {
    votes.push(['c', 'a', 'b']);
  });
  range(480).forEach(() => {
    votes.push(['c', 'b', 'a']);
  });
  range(400).forEach(() => {
    votes.push(['d', 'b', 'c']);
  });
  range(420).forEach(() => {
    votes.push(['d', 'c', 'b']);
  });
  range(440).forEach(() => {
    votes.push(['b', 'd', 'c']);
  });
  range(460).forEach(() => {
    votes.push(['c', 'd', 'b']);
  });
  range(480).forEach(() => {
    votes.push(['c', 'b', 'd']);
  });
  range(400).forEach(() => {
    votes.push(['d', 'e', 'c']);
  });
  range(420).forEach(() => {
    votes.push(['d', 'c', 'e']);
  });
  range(440).forEach(() => {
    votes.push(['e', 'd', 'c']);
  });
  range(460).forEach(() => {
    votes.push(['c', 'd', 'e']);
  });
  range(480).forEach(() => {
    votes.push(['c', 'e', 'd']);
  });
  range(400).forEach(() => {
    votes.push(['a', 'e', 'c']);
  });
  range(420).forEach(() => {
    votes.push(['a', 'f', 'b']);
  });
  range(440).forEach(() => {
    votes.push(['b', 'a', 'f']);
  });
  range(460).forEach(() => {
    votes.push(['f', 'a', 'b']);
  });
  range(480).forEach(() => {
    votes.push(['f', 'b', 'a']);
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
          a: 82,
          b: 44,
          c: 94,
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
          results: { a: 82, b: 44, c: 94 },
          outcome: {
            candidate: 'b',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 44,
            round: 1,
            seats: 0,
          },
        },
        {
          round: 2,
          results: { a: 126, c: 94 },
          outcome: {
            candidate: 'a',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 1,
            votesTransferred: 15,
          },
        },
        { round: 3, results: { c: 108.99999999999996 } },
      ]);
    });
    it('correctly tallies STV', async () => {
      data.test2.tallyVotes();
      const { reports } = data.test2.debug();

      expect(reports).toEqual([
        {
          round: 1,
          results: { a: 82, b: 44, c: 94 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 1,
            votesTransferred: 20,
          },
        },
        {
          round: 2,
          results: { a: 91.78723404255305, b: 54.21276595744666 },
          outcome: {
            candidate: 'a',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 1,
            votesTransferred: 17.787234042553052,
          },
        },
        { round: 3, results: { b: 71.99999999999967 } },
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
          results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
          outcome: {
            candidate: 'e',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 440,
            round: 1,
            seats: 0,
          },
        },
        {
          round: 2,
          results: { a: 1640, b: 1320, c: 2820, d: 2080, f: 940 },
          outcome: {
            candidate: 'f',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 940,
            round: 2,
            seats: 0,
          },
        },
        {
          round: 3,
          results: { a: 2100, b: 1800, c: 2820, d: 2080 },
          outcome: {
            candidate: 'b',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 1800,
            round: 3,
            seats: 0,
          },
        },
        {
          round: 4,
          results: { a: 3460, c: 2820, d: 2520 },
          outcome: {
            candidate: 'd',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 2520,
            round: 4,
            seats: 0,
          },
        },
        {
          round: 5,
          results: { a: 3460, c: 5340 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 5,
            seats: 1,
            votesTransferred: 939,
          },
        },
        { round: 6, results: { a: 3625.292134831411 } },
      ]);
    });
    it('works for STV', () => {
      data.bigSTV.tallyVotes();
      const { reports } = data.bigSTV.debug();

      expect(reports).toEqual([
        {
          round: 1,
          results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 1,
            votesTransferred: 619,
          },
        },
        {
          round: 2,
          results: {
            a: 1740.9716312056798,
            b: 1530.7234042553318,
            d: 1841.9432624113597,
            e: 545.3617021276659,
            f: 940,
          },
          outcome: {
            candidate: 'e',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 545.3617021276659,
            round: 2,
            seats: 0,
          },
        },
        {
          round: 3,
          results: {
            a: 1740.9716312056798,
            b: 1530.7234042553318,
            d: 2387.304964538812,
            f: 940,
          },
          outcome: {
            candidate: 'd',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 1,
            votesTransferred: 186.30496453881187,
          },
        },
        {
          round: 4,
          results: { a: 1740.9716312056798, b: 1602.595908875287, f: 940 },
          outcome: {
            candidate: 'f',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 940,
            round: 4,
            seats: 0,
          },
        },
        {
          round: 5,
          results: { a: 2200.97163120568, b: 2082.595908875287 },
          outcome: {
            candidate: 'b',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 2082.595908875287,
            round: 5,
            seats: 0,
          },
        },
        {
          round: 6,
          results: { a: 3666.3333333333458 },
          outcome: {
            candidate: 'a',
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
          results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 7,
            votesTransferred: 349,
          },
        },
        {
          round: 2,
          results: {
            a: 1696.9290780141682,
            b: 1438.8085106382914,
            d: 1753.8581560283365,
            e: 499.40425531915935,
            f: 940,
          },
          outcome: {
            candidate: 'd',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 4,
            votesTransferred: 341.85815602833645,
          },
        },
        {
          round: 3,
          results: {
            a: 1696.9290780141682,
            b: 1609.7375886525047,
            e: 670.3333333333111,
            f: 940,
          },
          outcome: {
            candidate: 'a',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 4,
            votesTransferred: 284.9290780141682,
          },
        },
        {
          round: 4,
          results: {
            b: 1756.981570100909,
            e: 737.4967950727031,
            f: 1010.5216348263618,
          },
          outcome: {
            candidate: 'b',
            action: 'ELECTED - MET QUOTA',
            round: 4,
            seats: 4,
            votesTransferred: 344.98157010090904,
          },
        },
        {
          round: 5,
          results: { e: 737.4967950727031, f: 1096.9151937728473 },
          outcome: {
            candidate: 'f',
            action: 'ELECTED - MET QUOTA',
            round: 5,
            seats: 3,
            votesTransferred: 37.91519377284726,
          },
        },
        {
          round: 6,
          results: { e: 737.4967950727031 },
          outcome: {
            candidate: 'e',
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
