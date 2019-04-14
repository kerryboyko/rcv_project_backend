import moment from 'moment';
import Election from '../../logic/Election';
import { dbSaveElection, dbLoadElection, dbCastVote } from './elections';

const testElection = new Election({
  title: 'Test Election',
  subtitle: 'testing the database',
});
const data: any = {};

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
        'electionStatus',
        'resultsVisibility',
        'electionType',
        'electionID',
      ].forEach((key: string) => {
        expect(testResult[key]).toEqual(testElection[key]);
      });
      expect(testResult.subtitle).toEqual('Subtitle has been altered');
      expect(testResult.pollsOpen).toBe(
        moment(testElection.pollsOpen).toISOString()
      );
      expect(testResult.pollsClose).toBe(
        moment(testElection.pollsClose).toISOString()
      );
    });
  });
  describe('dbCastVote', () => {
    it('casts a vote', async () => {
      await dbCastVote(testElection.electionID, 'FIRST', [
        'ALPHA',
        'BETA',
        'GAMMA',
      ]);
      const result = await dbLoadElection(testElection.electionID);
      expect(result.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
    });
    it('casts another vote', async () => {
      await dbCastVote(testElection.electionID, 'SECOND', [
        'BETA',
        'ALPHA',
        'DELTA',
      ]);
      const result = await dbLoadElection(testElection.electionID);
      expect(result.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
      expect(result.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
      expect(result.voterIds).toContain('FIRST');
      expect(result.voterIds).toContain('SECOND');
    });
    it('does not let the voter cast twice', async () => {
      await dbCastVote(testElection.electionID, 'FIRST', [
        'ALPHA',
        'BETA',
        'GAMMA',
        'DELTA',
      ]).catch((errMsg: string) => {
        data.errMsg = errMsg;
      });
      expect(data.errMsg).toBe(
        'Voter: FIRST has already cast a ballot in this election'
      );
      const result = await dbLoadElection(testElection.electionID);

      expect(result.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
      expect(result.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
      expect(result.votes).not.toContainEqual([
        'ALPHA',
        'BETA',
        'GAMMA',
        'DELTA',
      ]);
      expect(result.voterIds).toContain('FIRST');
      expect(result.voterIds).toContain('SECOND');
    });
    it('does not let the voter vote after the poll has closed', async () => {
      testElection.pollsClose = moment().subtract({ minutes: 30 });
      await dbSaveElection(testElection);
      const result1 = await dbLoadElection(testElection.electionID);
      expect(moment(result1.pollsClose).isBefore(moment())).toBe(true);
      await dbCastVote(testElection.electionID, 'LATE', [
        'ALPHA',
        'BETA',
        'GAMMA',
        'DELTA',
      ]).catch((errMsg: string) => {
        data.errMsg2 = errMsg;
      });
      expect(data.errMsg2.substring(0, 66)).toBe(
        'Your vote was not recorded, because polls have closed for election'
      );

      const result2 = await dbLoadElection(testElection.electionID);
      expect(result2.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
      expect(result2.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
      expect(result2.votes).not.toContainEqual([
        'ALPHA',
        'BETA',
        'GAMMA',
        'DELTA',
      ]);
      expect(result2.voterIds).toContain('FIRST');
      expect(result2.voterIds).toContain('SECOND');
      expect(result2.voterIds).not.toContain('LATE');
    });
  });
});
