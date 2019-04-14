import connect from '../connect';
import { ObjectID } from 'mongodb';
import Election from '../../logic/Election';
import moment from 'moment';
import pick from 'lodash/pick';

const DATABASE_NAME = process.env.NODE_ENV === 'test' ? 'stv_test' : 'stv';

const initElections = async () => {
  const { db, dbClose } = await connect(DATABASE_NAME);
  const dbElections = db.collection('elections');
  return { dbElections, dbClose };
};

export const dbLoadElection = async (electionID: string) => {
  const { dbElections, dbClose } = await initElections();
  try {
    const result = await dbElections.findOne({ _id: new ObjectID(electionID) });
    dbClose();
    return result;
  } catch (err) {
    dbClose();
    throw new Error(err);
  }
};

export const dbSaveElection = async (election: Election) => {
  const { dbElections, dbClose } = await initElections();

  const payload = {
    ...pick(election, [
      'title',
      'subtitle',
      'reports',
      'electionStatus',
      'resultsVisibility',
      'electionType',
      'electionID',
    ]),
    pollsOpen: moment(election.pollsOpen).toISOString(),
    pollsClose: moment(election.pollsClose).toISOString(),
    // to preserve secrecy, we should store the votes, and who has voted, but not together.
    voterIds: [],
    votes: [],
  };
  const electionID = new ObjectID(election.electionID);
  try {
    // will create a new record if electionID is has just been created because upsert = true;
    const result = await dbElections.findOneAndUpdate(
      { _id: electionID },
      { $set: payload },
      { upsert: true, returnOriginal: false }
    );
    dbClose();
    return result;
  } catch (err) {
    dbClose();
    throw new Error(err);
  }
};

export const dbCastVote = async (
  electionID: string,
  voterId: string,
  vote: string[]
) => {
  const { dbElections, dbClose } = await initElections();
  const dbID = new ObjectID(electionID);
  try {
    // check if election exists and is unique
    const electionExists = await dbElections.count({
      _id: dbID,
    });
    if (electionExists !== 1) {
      dbClose();
      if (electionExists < 1) {
        throw new Error(
          `Election with electionID: ${electionID} does not exist`
        );
      } else {
        throw new Error(
          `SERIOUS ERROR: ${electionExists} elections exist with the same ID: ${electionID}`
        );
      }
    }

    // check if user has not yet voted
    const voterRecord = await dbElections.findOne(
      { _id: dbID },
      { projection: { voterIds: true } }
    );
    if (voterRecord.voterId.includes(voterId)) {
      dbClose();
      throw new Error(
        `Voter: ${voterId} has already cast a ballot in this election`
      );
    }

    // save the vote
    const result = await dbElections.findOneAndUpdate(
      { _id: dbID },
      {
        $push: {
          votes: vote,
          voterIds: voterId,
        },
      },
      { upsert: false }
    );
    dbClose();
    return result;
  } catch (err) {
    dbClose();
    throw new Error(err);
  }
};

export default { dbLoadElection, dbSaveElection, dbCastVote };
