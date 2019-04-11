import { range } from 'lodash';
import VoteTallier, { TallyType } from './VoteTallier';
import Ballot from './Ballot';

const genVotes = () => {
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

const sample = genVotes();
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
      expect(
        data.test1.ballots.map((ballot: Ballot): string[] => ballot.candidates)
      ).toEqual(sample);
      expect(data.test1.seats).toEqual(1);
      expect(data.test1.quota).toEqual(111);
    });
    it('constructs a multiseat vote', () => {
      data.test2 = new VoteTallier({
        votes: sample,
        tallyType: TallyType.MultiSeat,
        seats: 3,
      });
      expect(
        data.test2.ballots.map((ballot: Ballot): string[] => ballot.candidates)
      ).toEqual(sample);
      expect(data.test2.seats).toEqual(3);
      expect(data.test2.quota).toEqual(56);
    });
  });
  describe('VoteTallier.getRound()', () => {
    it('correctly tallies one round of votes', () => {
      const round1 = data.test1.getRound();
      expect(round1).toEqual({
        round: 1,
        results: {
          a: 82,
          b: 44,
          c: 94,
        },
      });
    });
  });
});
