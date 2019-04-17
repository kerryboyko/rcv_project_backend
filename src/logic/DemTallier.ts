import Ballot from './Ballot';
import {
  CandidateAction,
  ElectionType,
  IElectedSeat,
  IVoteTallier,
  IVotingRoundReport,
  VoteTuple,
} from '../types';
import droopQuota from './droopQuota';

// magic numbers
const MINIMUM_THRESH = 0.15;
const NH_DELEGATES = 24;

const findLeader = (results: { [key: string]: number }): VoteTuple =>
  Object.entries(results).reduce((pv: VoteTuple, cv: VoteTuple) =>
    cv[1] > pv[1] ? cv : pv
  );

const findLagger = (results: { [key: string]: number }): VoteTuple =>
  Object.entries(results).reduce((pv: VoteTuple, cv: VoteTuple) =>
    cv[1] < pv[1] ? cv : pv
  );

export default class DemTallier {
  private ballots: Ballot[];
  private delegates: number = NH_DELEGATES;
  private quota: number = 0;
  private thresh: number = 0;
  private round: number = 1;
  private reports: IVotingRoundReport[] = [];
  private elected: Set<string> = new Set();
  private eliminated: Set<string> = new Set();

  constructor(public readonly votes: string[][]) {
    this.ballots = votes.map((vote: string[]) => new Ballot(vote));
    const votesCast: number = votes.length;
    this.quota = droopQuota(votesCast, NH_DELEGATES);
    this.thresh = votesCast * MINIMUM_THRESH;
  }

  private tallyVotes = (): void => {
    const initialReport: IVotingRoundReport = this.getInitialReport();
    if (
      this.delegates <= 0 ||
      Object.keys(initialReport.results).length === 0
    ) {
      // if we've already assigned all the seats,
      return this.finalReport(initialReport); // returns void.
    }
    const voteValues = Object.values(initialReport.results);
    // if we have an equal number of seats and candidates
    if (voteValues.length === this.seats) {
      this.assignSeatsByDefault(initialReport);
    } else if (voteValues.some((res: number) => res >= this.quota)) {
      this.assignSeat(initialReport);
    } else {
      this.eliminateLastCandidate(initialReport);
    }
    this.tallyVotes(); // call recursively, do not return to save callstack.
  };
}
