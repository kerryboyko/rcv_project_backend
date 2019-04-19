import { Moment } from 'moment';

export enum ElectionType {
  InstantRunoff = 'INSTANT_RUNOFF',
  MultiSeat = 'MULTI_SEAT',
  DemocraticPrimary = 'DEMOCRATIC_PRIMARY',
}

export enum CandidateAction {
  elected = 'ELECTED - MET QUOTA',
  assigned = 'ELECTED - OTHER CANDIDATES ELIMINATED',
  eliminated = 'ELIMINATED - FEWEST VOTES',
  eliminatedThresh = 'ELIMINATED - FAILED TO PASS THRESHOLD',
  nextRound = 'PASSED - PASSED THRESHOLD',
  delegateAwarded = 'DELEGATE_AWARDED - CANDIDATE ASSIGNED DELEGATE',
}

// Candidate shortcode, number of votes;
export type VoteTuple = [string, number];

export type VoteRecord = string[][];

export interface IVoteCount {
  [key: string]: number;
}

export interface IElectedSeat {
  candidate: string;
  action: CandidateAction;
  seats: number;
  round: number;
  votesTransferred: number;
  changes?: any;
}

export interface IVotingRoundReport {
  round: number;
  results: IVoteCount;
  outcome?: IElectedSeat[];
}

export interface IVoteTallier {
  votes: VoteRecord;
  electionType?: ElectionType;
  seats?: number; // number of seats up for grabs OR number of total delegates;
}

export enum ElectionStatus {
  DRAFT = 'DRAFT',
  QUEUED = 'QUEUED',
  IN_PROGRESS = 'IN_PROGRESS',
  POLLS_CLOSED = 'POLLS_CLOSED',
}

export enum ElectionResultsVisibility {
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

export type BallotTuple = [string[], number]; // votes, weight;

export interface IJeffersonTally {
  [key: string]: {
    seatsAllocated: number;
    votes: number;
  };
}
