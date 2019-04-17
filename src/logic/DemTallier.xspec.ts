import DemTallier from './DemTallier';
import { VoteRecord } from '../types';
import { genPrimary } from './genElections';

const sample: VoteRecord = genPrimary();
const demTallier = new DemTallier(sample);

describe('class DemTallier()', () => {
  it('ballots', () => {
    const stuff = ['ALPHA', 'BETA', 'GAMMA', 'DELTA', 'EPSILON', 'ZETA'];
    const b = new Ballot([
      'ALPHA',
      'BETA',
      'GAMMA',
      'DELTA',
      'EPSILON',
      'ZETA',
    ]);
    expect(b.getWeight()).toBe(1.0);
    expect(b.votingPrefs).toEqual(stuff);
    expect(b.getPref()).toBe('ALPHA');
  });
  it('constructor()', () => {
    expect(demTallier.votes).toEqual(sample);
    expect(demTallier.votes.length).toBe(8800);
    expect(demTallier.quota).toBe(353);
    expect(demTallier.thresh).toBe(1320);
    expect(demTallier.round).toBe(1);
    expect(demTallier.elected.size).toBe(0);
    expect(demTallier.eliminated.size).toBe(0);
  });
  it('correctly assigns the delegates', () => {
    const report = demTallier.tallyVotes();
    console.log(JSON.stringify(report, null, 2));
    expect(Array.isArray(report)).toBe(true);
  });
});
