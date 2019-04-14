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
    return Promise.reject(err);
  }
};

export const dbSaveElection = async (election: Election) => {
  const { dbElections, dbClose } = await initElections();

  const payload = {
    ...pick(election, [
      'title',
      'subtitle',
      'electionStatus',
      'resultsVisibility',
      'electionType',
      'electionID',
    ]),
    pollsOpen: moment(election.pollsOpen).toISOString(),
    pollsClose: moment(election.pollsClose).toISOString(),
    // to preserve secrecy, we should store the votes, and who has voted, but not together.
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
    return Promise.reject(err);
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
    const electionExists = await dbElections.findOne({
      _id: dbID,
    });
    if (!electionExists) {
      dbClose();
      return Promise.reject(
        `Election with electionID: ${electionID} does not exist`
      );
    }
    if (moment().isAfter(moment(electionExists.pollsClose))) {
      dbClose();
      return Promise.reject(
        `Your vote was not recorded, because polls have closed for election ${
          electionExists.electionID
        } at ${electionExists.pollsClose},`
      );
    }

    // check if user has not yet voted
    const voterRecord = await dbElections.findOne(
      { _id: dbID },
      { projection: { voterIds: true } }
    );
    if (
      Array.isArray(voterRecord.voterIds) &&
      voterRecord.voterIds.includes(voterId)
    ) {
      dbClose();
      return Promise.reject(
        `Voter: ${voterId} has already cast a ballot in this election`
      );
    }

    // save the vote
    // If the field is absent in the document to update,
    // $push adds the array field with the value as its element.
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
    return Promise.reject(err);
  }
};

export default { dbLoadElection, dbSaveElection, dbCastVote };
