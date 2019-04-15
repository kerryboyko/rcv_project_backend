import runServer from '../../init';
import axios from 'axios';
import moment from 'moment';
import {
  ElectionStatus,
  ElectionResultsVisibility,
  ElectionType,
} from '../../../types';
import omit from 'lodash/omit';
const testElection = {
  title: 'API Test Election',
  subtitle: 'testing the database',
  electionStatus: ElectionStatus.DRAFT,
  resultsVisibility: ElectionResultsVisibility.LIVE,
  electionType: ElectionType.InstantRunoff,
  seats: 1,
  pollsOpen: moment().toISOString(),
  pollsClose: moment()
    .add({ hours: 12 })
    .toISOString(),
};

const cache: any = {};
// TODO: test 500 route responses;;
describe('server/api/v1/elections', () => {
  beforeAll(async () => {
    cache.server = await runServer(4444);
    return cache.server;
  });
  describe('POST localhost:4444/api/v1/elections/create', () => {
    it('posts a new election', async () => {
      const { data }: any = await axios({
        method: 'post',
        url: 'http://localhost:4444/api/v1/elections/create',
        data: testElection,
      }).catch(console.warn);
      cache.id = data._id;
      expect(omit(data, ['_id'])).toEqual({
        ...testElection,
        votes: [],
        voterIds: [],
      });
    });
  });
  describe('GET http://localhost:4444/api/v1/elections/:electionID', () => {
    it("gets an election's data", async () => {
      const { data }: any = await axios({
        method: 'get',
        url: `http://localhost:4444/api/v1/elections/${cache.id}`,
      }).catch(console.warn);
      expect(data).toEqual({
        ...testElection,
        votes: [],
        voterIds: [],
        _id: cache.id,
      });
    });
  });
  describe('PATCH http://localhost:4444/api/v1/elections/:electionID', () => {
    it("alter's an election's data", async () => {
      const { data }: any = await axios({
        method: 'patch',
        url: `http://localhost:4444/api/v1/elections/${cache.id}`,
        data: {
          subtitle: 'updated subtitle',
        },
      }).catch(console.warn);
      expect(data).toEqual({
        ...testElection,
        subtitle: 'updated subtitle',
        votes: [],
        voterIds: [],
        _id: cache.id,
      });
    });
  });
  describe('PATCH http://localhost:4444/api/v1/elections/:electionID/vote', () => {
    it('casts a ballot', async () => {
      const { data }: any = await axios({
        method: 'patch',
        url: `http://localhost:4444/api/v1/elections/${cache.id}/vote`,
        data: {
          voterId: 'API FIRST',
          vote: ['LAZERHAWK', 'PURTURBATOR', 'KAVINSKY'],
        },
      }).catch(console.warn);
      expect(data).toEqual({
        ...testElection,
        subtitle: 'updated subtitle',
        electionID: cache.id,
        vote: ['LAZERHAWK', 'PURTURBATOR', 'KAVINSKY'],
        voterId: 'API FIRST',
      });
    });
    it('casts a 2nd ballot', async () => {
      const { data }: any = await axios({
        method: 'patch',
        url: `http://localhost:4444/api/v1/elections/${cache.id}/vote`,
        data: {
          voterId: 'API SECOND',
          vote: ['LAZERHAWK', 'KAVINSKY', 'STROM'],
        },
      }).catch(console.warn);
      expect(data).toEqual({
        ...testElection,
        subtitle: 'updated subtitle',
        electionID: cache.id,
        vote: ['LAZERHAWK', 'KAVINSKY', 'STROM'],
        voterId: 'API SECOND',
      });
    });
    it("won't let anyone vote twice", async () => {
      const something: any = await axios({
        method: 'patch',
        url: `http://localhost:4444/api/v1/elections/${cache.id}/vote`,
        data: {
          voterId: 'API SECOND',
          vote: ['LAZERHAWK', 'KAVINSKY', 'STROM'],
        },
      }).catch(err => {
        cache.catcherr = err.response.data;
      });
      expect(something).toBeUndefined();
      expect(cache.catcherr).toBe(
        `Voter: API SECOND has already cast a ballot in this election`
      );
    });
  });
  afterAll(async () => {
    return cache.server.close();
  });
});
