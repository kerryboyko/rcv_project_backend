import connect from '../connect';
import { ObjectID } from 'mongodb';
import moment from 'moment';
import { IElection } from '../../types';

const DATABASE_NAME = process.env.NODE_ENV === 'test' ? 'stv_test' : 'stv';

const initElections = async () => {
  const { db, dbClose } = await connect(DATABASE_NAME);
  const dbElections = db.collection('elections');
  return { dbElections, dbClose };
};

export const dbCreateElection = async (data: IElection): Promise<string> => {
  const payload: IElection = {
    title: data.title,
    subtitle: data.subtitle,
    electionStatus: data.electionStatus,
    resultsVisibility: data.resultsVisibility,
    electionType: data.electionType,
    seats: data.seats,
    pollsOpen: moment.isMoment(data.pollsOpen)
      ? data.pollsOpen.toISOString()
      : data.pollsOpen,
    pollsClose: moment.isMoment(data.pollsClose)
      ? data.pollsClose.toISOString()
      : data.pollsClose,
    voterIds: [],
    votes: [],
  };
  const { dbElections, dbClose } = await initElections();
  try {
    const { insertedId } = await dbElections.insertOne(payload);
    dbClose();
    return insertedId.toHexString();
  } catch (err) {
    dbClose();
    return Promise.reject(err);
  }
};

export const dbRetrieveElection = async (electionID: string): Promise<any> => {
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

export const dbUpdateElection = async (electionID: string, changes: any) => {
  Object.keys(changes).forEach((key: string) => {
    if (moment.isMoment(changes[key])) {
      changes[key] = changes[key].toISOString;
    }
  });
  const existing = await dbRetrieveElection(electionID);
  if (!existing) {
    return Promise.reject(
      `Document with ObjectID ${electionID} does not exist in collection 'elections'`
    );
  }
  const { dbElections, dbClose } = await initElections();
  try {
    // will create a new record if electionID is has just been created because upsert = true;
    const result = await dbElections.findOneAndUpdate(
      { _id: new ObjectID(electionID) },
      { $set: changes },
      { returnOriginal: false }
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
    const existingElection = await dbElections.findOne(
      {
        _id: dbID,
      },
      {
        projection: {
          voterIds: true,
          pollsClose: true,
          pollsOpen: true,
        },
      }
    );
    // if election doesn't exist;
    if (!existingElection) {
      dbClose();
      return Promise.reject(
        `Election with electionID: ${electionID} does not exist`
      );
    }
    // if polls are not yet open
    if (moment().isBefore(moment(existingElection.pollsOpen))) {
      dbClose();
      return Promise.reject(
        `Your vote was not recorded, because polls have not yet opened for election ${electionID}. Try again at ${
          existingElection.pollsOpen
        },`
      );
    }
    // if polls are closed;
    if (moment().isAfter(moment(existingElection.pollsClose))) {
      dbClose();
      return Promise.reject(
        `Your vote was not recorded, because polls have closed for election ${electionID} at ${
          existingElection.pollsClose
        },`
      );
    }
    // if you've already voted;
    if (
      Array.isArray(existingElection.voterIds) &&
      existingElection.voterIds.includes(voterId)
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

export default {
  dbCreateElection,
  dbRetrieveElection,
  dbUpdateElection,
  dbCastVote,
};
