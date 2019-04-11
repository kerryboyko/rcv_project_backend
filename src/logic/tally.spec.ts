import { range } from 'lodash';
import VoteTallier, { TallyType, VoteRecord } from './VoteTallier';
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
        tallyType: TallyType.MultiSeat,
        seats: 3,
      });
      const results2 = data.test2.debug();
      expect(
        results2.ballots.map((ballot: Ballot): string[] => ballot.candidates)
      ).toEqual(sample);
      expect(results2.seats).toEqual(3);
      expect(results2.quota).toEqual(56);
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
      expect(data.test1.q)
      expect(round).toEqual(data.expected);
    });
  });
  describe('VoteTallier.tallyVotes()', () => {
    it('correctly tallies Instant Runoff', () => {
      data.test1.tallyVotes();
      const { reports } = data.test1.debug();
      expect(reports).toEqual([
        {
          round: 1,
          results: { a: 82, b: 44, c: 94 },
          eliminated: {
            candidate: 'b',
            votesTransferred: 44,
            round: 1,
            seats: 0,
          },
        },
        {
          round: 2,
          results: { a: 126, c: 94 },
          elected: { candidate: 'a', round: 2, seats: 1, votesTransferred: 15 },
        },
        { round: 3,
        results: {c: 108.99999999999996}}
      ]);
    });
  });
});
