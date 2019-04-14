// this isn't ready yet.  I have to test the database first.

import {
  ElectionStatus,
  ElectionResultsVisibility,
  IElection,
  ElectionType,
  IVotingRoundReport,
} from '../types';
import moment from 'moment'; // Use instead of JS date.
import {
  dbSaveElection,
  dbLoadElection,
  dbCastVote,
} from '../db/controllers/elections';
import { ObjectID } from 'mongodb';

export default class Election implements IElection {
  [key: string]: any;
  public title: string = 'New Election';
  public subtitle?: string;
  public pollsOpen: moment.Moment;
  public pollsClose: moment.Moment;
  public electionID: string = new ObjectID().toHexString();
  public reports: IVotingRoundReport[] = [];
  public electionStatus: ElectionStatus = ElectionStatus.DRAFT;
  public resultsVisibility: ElectionResultsVisibility =
    ElectionResultsVisibility.AFTER_CLOSE;
  public electionType: ElectionType = ElectionType.InstantRunoff;
  public seats: number = 1;
  // votes are the voting records, and should be considered read/write only, no mutations allowed.
  // private votes: string[][] = [];

  // you can't have an async constructor.
  constructor(initialSettings?: any) {
    ['title', 'subtitle', 'resultsVisibility', 'electionType', 'seats'].forEach(
      (key: string) => {
        if (initialSettings[key]) {
          this[key] = initialSettings[key];
        }
      }
    );
    this.pollsOpen = moment(initialSettings.pollsOpen) || moment();
    this.pollsClose = initialSettings.pollsClose
      ? moment(initialSettings.pollsClose)
      : moment().add({ hours: 24 });

    this.saveElection();
  }

  public clone = ({ sameID = false }: { sameID: boolean }) => {
    const cloneElection = new Election(this);
    if (sameID) {
      cloneElection.electionID = this.electionID;
    }
    return cloneElection;
  };

  public saveElection = async () => {
    try {
      return await dbSaveElection(this);
    } catch (err) {
      throw new Error(err);
    }
  };

  public loadElection = async (electionID?: string) => {
    if (!electionID) {
      if (!this.electionID) {
        throw new Error('No Election ID provided');
      }
      electionID = this.electionID;
    }
    try {
      const payload = await dbLoadElection(electionID);
      const result = this.formatFromDb(payload);
      Object.keys(result).forEach((key: string) => {
        this[key] = result[key];
      });
    } catch (err) {
      throw new Error(err);
    }
  };

  public castVote = async (voterId: string, vote: string[]) => {
    if (moment().isAfter(this.pollsClose)) {
      throw new Error('Votes cannot be cast after the polls are closed');
    }
    if (this.electionID) {
      try {
        return await dbCastVote(this.electionID, voterId, vote);
      } catch (err) {
        throw new Error(err);
      }
    } else {
      throw new Error('Election.electionID is undefined');
    }
  };

  private formatFromDb = (payload: any): IElection => ({
    title: payload.title,
    subtitle: payload.subtitle,
    pollsOpen: moment(payload.pollsOpen),
    pollsClose: moment(payload.pollsClose),
    reports: payload.reports,
    electionStatus: payload.electionStatus,
    resultsVisibility: payload.resultsVisibility,
    electionID: payload.electionID.toHexString(),
    votes: payload.votes,
  });
}
