import moment from 'moment'
import Election from '../../logic/Election';
import { dbSaveElection, dbLoadElection } from './elections';
const testElection = new Election({
  title: 'Test Election',
  subtitle: 'testing the database',
});

describe('db/controllers/elections.ts', () => {
  describe('Elections class is good enough for this test', () => {
    it('creates an electionID', () => {
      expect(typeof testElection.electionID).toBe('string');
      expect(testElection.electionID).toHaveLength(24);
    });
    it('has the other properties', () => {
      expect(testElection.reports).toEqual([]);
      expect(testElection.electionStatus).toBe('DRAFT');
      expect(testElection.resultsVisibility).toBe('AFTER_CLOSE');
      expect(testElection.electionType).toBe('INSTANT_RUNOFF');
      expect(testElection.seats).toBe(1);
    });
  });
  describe('dbSaveElection()', () => {
    it('saves a new election', async () => {
      const testResult = await dbSaveElection(testElection);
      expect(testResult.ok).toBe(1);
      expect(testResult.value._id.toHexString()).toBe(testElection.electionID);
      [
        'title',
        'subtitle',
        'reports',
        'electionStatus',
        'resultsVisibility',
        'electionType',
        'electionID',
      ].forEach((key: string) => {
        expect(testResult.value[key]).toEqual(testElection[key]);
      });
    });
    it('updates an already existing election', async () => {
      const alteredElection = testElection.clone({ sameID: true });
      alteredElection.subtitle = 'Subtitle has been altered';
      const testResult = await dbSaveElection(alteredElection);
      expect(testResult.ok).toBe(1);
      expect(testResult.value._id.toHexString()).toBe(testElection.electionID);
      expect(testResult.value.subtitle).toBe('Subtitle has been altered');
    });
  });
  describe('dbLoadElection()', () => {
    it('retrieves an election', async () => {
      const testResult = await dbLoadElection(testElection.electionID);
      [
        'title',
        'reports',
        'electionStatus',
        'resultsVisibility',
        'electionType',
        'electionID',
      ].forEach((key: string) => {
        expect(testResult[key]).toEqual(testElection[key]);
      });
      expect(testResult.subtitle).toEqual('Subtitle has been altered'); 
      expect(testResult.pollsOpen).toBe(moment(testElection.pollsOpen).toISOString());
      expect(testResult.pollsClose).toBe(moment(testElection.pollsClose).toISOString()); 
 
    })
  })
});
