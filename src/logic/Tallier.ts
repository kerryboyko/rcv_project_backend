import { CandidateAction, IVotingRoundReport } from '../types';

import { BallotTuple } from '../types';
import {
  findLeader,
  findLagger,
  countValidBallots,
  countCurrentPrefs,
  calcDroopQuota,
  reduceIdenticalBallots,
} from './tallierUtils';

import cloneDeep from 'lodash/cloneDeep';

export default class Tallier {
  public ballots: BallotTuple[];
  public quota: number;
  public seatsRemaining: number;
  public winners: Map<string, number> = new Map();
  public reports: IVotingRoundReport[] = [];
  public round: number = 0;
  public currentPreferences: { [key: string]: number } = {};

  constructor(
    public readonly votes: string[][],
    public readonly seatsInContest: number
  ) {
    this.seatsRemaining = seatsInContest;
    this.ballots = reduceIdenticalBallots(
      votes.map((vote: string[]): BallotTuple => [vote, 1])
    );
    const validBallots = countValidBallots(this.ballots);
    this.quota = calcDroopQuota(validBallots, seatsInContest);
  }

  public tally = (): void => {
    if (this.seatsRemaining === 0) {
      return;
    }
    this.round += 1;
    this.currentPreferences = countCurrentPrefs(this.ballots);
    const remainingCandidates = Object.keys(this.currentPreferences);
    if (remainingCandidates.length === this.seatsRemaining) {
      this.assignRemainingSeatsSTV(remainingCandidates);
      return;
    }
    const [leader, leaderVotes] = findLeader(this.currentPreferences);
    if (leaderVotes >= this.quota) {
      this.seatWinnerSTV(leader, leaderVotes);
      this.seatsRemaining += -1;
      this.tally();
      return;
    }
    const [lagger, laggerVotes] = findLagger(this.currentPreferences);
    this.eliminateLoser(lagger, laggerVotes);
    this.tally();
  };

  private assignRemainingSeatsSTV = (remainingCandidates: string[]) => {
    remainingCandidates.forEach((candidate: string) => {
      this.winners.set(candidate, 1);
      this.seatsRemaining += -1;
    });
    this.reports.push({
      round: this.round,
      results: this.currentPreferences,
      outcome: remainingCandidates.map((candidate: string) => ({
        candidate,
        action: CandidateAction.assigned,
        seats: 1,
        round: this.round,
        votesTransferred: 0,
      })),
    });
    return this.reports;
  };

  private eliminateLoser = (loser: string, votes: number) => {
    const newBallots = reduceIdenticalBallots(
      this.ballots.slice().map(
        (ballot: BallotTuple): BallotTuple => {
          const [vote, weight] = ballot;
          const newVote = vote.slice().filter((cand: string) => cand !== loser);
          return [newVote, weight];
        }
      )
    );
    const newPrefs = countCurrentPrefs(newBallots);
    const oldPrefs = cloneDeep(this.currentPreferences);
    const changes = Object.keys(newPrefs).reduce((pv: any, cv: string) => {
      pv[cv] = newPrefs[cv] - oldPrefs[cv];
      return pv;
    }, {});
    this.reports.push({
      round: this.round,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: loser,
          action: CandidateAction.eliminated,
          seats: 0,
          round: this.round,
          votesTransferred: votes,
          changes,
        },
      ],
    });
    this.currentPreferences = newPrefs;
    this.ballots = newBallots;
  };

  private seatWinnerSTV = (winner: string, votes: number) => {
    this.winners.set(winner, 1);
    const votesTransferred = votes - this.quota;
    const percentage = votesTransferred / votes;
    const newBallots = reduceIdenticalBallots(
      this.ballots.slice().map(
        (ballot: BallotTuple): BallotTuple => {
          const [vote, weight] = ballot;
          const newVote = vote
            .slice()
            .filter((cand: string) => cand !== winner);
          if (vote[0] === winner) {
            const newWeight = weight * percentage;
            return [newVote, newWeight];
          }
          return [newVote, weight];
        }
      )
    );
    const newPrefs = countCurrentPrefs(newBallots);
    const oldPrefs = { ...this.currentPreferences };
    const changes = Object.keys(newPrefs).reduce((pv: any, cv: string) => {
      pv[cv] = newPrefs[cv] - oldPrefs[cv];
      return pv;
    }, {});
    this.reports.push({
      round: this.round,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: winner,
          action: CandidateAction.elected,
          seats: 1,
          round: this.round,
          votesTransferred,
          changes,
        },
      ],
    });
    this.currentPreferences = newPrefs;
    this.ballots = newBallots;
  };
}
