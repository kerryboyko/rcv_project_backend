import { Moment } from 'moment';
export declare enum ElectionType {
  InstantRunoff = 'INSTANT_RUNOFF',
  MultiSeat = 'MULTI_SEAT',
  DemocraticPrimary = 'DEMOCRATIC_PRIMARY',
}
export declare enum CandidateAction {
  elected = 'ELECTED - MET QUOTA',
  assigned = 'ELECTED - OTHER CANDIDATES ELIMINATED',
  eliminated = 'ELIMINATED - FEWEST VOTES',
}
export declare type VoteTuple = [string, number];
export declare type VoteRecord = string[][];
export interface IElectedSeat {
  candidate: string;
  action: CandidateAction;
  seats: number;
  round: number;
  votesTransferred: number;
}
export interface IVotingRoundReport {
  round: number;
  results: {
    [key: string]: number;
  };
  outcome?: IElectedSeat;
}
export interface IVoteTallier {
  votes: VoteRecord;
  electionType?: ElectionType;
  seats?: number;
}
export declare enum ElectionStatus {
  DRAFT = 'DRAFT',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  POLLS_CLOSED = 'POLLS_CLOSED',
}
export declare enum ElectionResultsVisibility {
  LIVE = 'LIVE',
  LIVE_FOR_VOTERS = 'LIVE_FOR_VOTERS',
  AFTER_CLOSE = 'AFTER_CLOSE',
}
export interface IElection {
  title: string;
  subtitle?: string;
  pollsOpen: Moment | string;
  pollsClose: Moment | string;
  electionID?: string;
  resultsVisibility: ElectionResultsVisibility;
  electionStatus: ElectionStatus;
  [key: string]: any;
}
//# sourceMappingURL=index.d.ts.map
