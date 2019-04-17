import {
  countValidBallots,
  countCurrentPrefs,
  findLeader,
  reduceIdenticalBallots,
  findLagger,
  calcDroopQuota,
} from './tallierUtils';
import { BallotTuple, CandidateAction } from '../types';
// magic numbers;
const DEM_MINIMUM_THRESH = 0.15;
const NH_DELEGATES = 24;

export default class DemTallier {
  public ballots: BallotTuple[];
  public thresh: number = 0;
  public losers: Set<string> = new Set();
  public winners: Set<string> = new Set();
  public threshReports: any[] = [];
  public threshRound: number = 0;
  public currentPreferences: { [key: string]: number } = {};
  public finalReports: any[] = [];
  public round: number = 0;
  public wastedVotes: number = 0;
  public quota: number = 0;
  public delegateAssignments: Map<string, number> = new Map();
  private delegates: number = NH_DELEGATES;

  constructor(
    public readonly votes: string[][] // public readonly delegateAmount: number
  ) {
    this.ballots = reduceIdenticalBallots(
      votes.map((vote: string[]): BallotTuple => [vote, 1])
    );
    const validBallots: number = countValidBallots(this.ballots);
    this.thresh = Math.floor(validBallots * DEM_MINIMUM_THRESH);
    this.delegates = NH_DELEGATES;
  }

  public threshTally = (): string[] => {
    this.currentPreferences = countCurrentPrefs(this.ballots);
    this.threshRound += 1;
    // end case;
    if (countValidBallots(this.ballots) < this.thresh) {
      Object.entries(this.currentPreferences).forEach(
        ([cand, candVotes]: [string, number]) => {
          this.eliminateLoserThresh(cand, candVotes);
        }
      );
      return Array.from(this.winners.values());
    } //
    const [leader, leaderVotes] = findLeader(this.currentPreferences);
    if (leaderVotes >= this.thresh) {
      this.setWinnerThresh(leader, leaderVotes);
      return this.threshTally();
    }
    const [lagger, laggerVotes] = findLagger(this.currentPreferences);
    this.eliminateLoserThresh(lagger, laggerVotes);
    return this.threshTally();
  };

  public tally = () => {
    this.threshTally();
    this.resetVotesAfterThresh();
  };

  public resetVotesAfterThresh = () => {
    const originalVoteCount = this.votes.length;
    this.ballots = reduceIdenticalBallots(
      this.votes.map(
        (vote: string[]): BallotTuple => [this.winnersOnly(vote), 1]
      )
    );
    const validBallotCount: number = countValidBallots(this.ballots);
    this.wastedVotes = originalVoteCount - validBallotCount;
    this.quota = calcDroopQuota(validBallotCount, NH_DELEGATES);
  };

  public tallyFinal = (): Map<string, number> => {
    this.currentPreferences = countCurrentPrefs(this.ballots);
    this.round += 1;
    // end case;
    if (this.delegates === 0) {
      return this.delegateAssignments;
    }
    const [leader, leaderVotes] = findLeader(this.currentPreferences);
    if (Object.keys(this.currentPreferences).length === 1) {
      this.assignDelegatesFinal(leader);
      return this.tallyFinal();
    }
    if (leaderVotes >= this.quota) {
      this.setDelegatesFinal(leader, leaderVotes);
      return this.tallyFinal();
    }
    const [lagger, laggerVotes] = findLagger(this.currentPreferences);
    this.eliminateLoserFinal(lagger, laggerVotes); // unlikely to happen since thresh is usually higher than quota;
    return this.tallyFinal();
  };

  private assignDelegatesFinal = (leader: string) => {
    this.delegateAssignments.set(leader, this.delegates);
    this.finalReports.push({
      round: this.round,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: leader,
          action: CandidateAction.assigned,
          seats: this.delegates,
          round: this.round,
          votesTransferred: 0,
        },
      ],
    });
    this.delegates = 0;
  };

  private setDelegatesFinal = (winner: string, winnerVotes: number) => {
    const seatsAssigned = Math.floor(winnerVotes / this.quota);
    const votesTransferred = winnerVotes - this.quota * seatsAssigned;
    const percentage = votesTransferred / winnerVotes;
    this.delegates -= seatsAssigned;
    this.delegateAssignments.set(winner, seatsAssigned);
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
    this.finalReports.push({
      round: this.round,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: winner,
          action: CandidateAction.elected,
          seats: seatsAssigned,
          round: this.threshRound,
          votesTransferred,
          changes,
        },
      ],
    });
    this.ballots = newBallots;
  };

  private eliminateLoserFinal = (loser: string, votes: number) => {
    this.losers.add(loser);
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
    const oldPrefs = { ...this.currentPreferences };
    const changes = Object.keys(newPrefs).reduce((pv: any, cv: string) => {
      pv[cv] = newPrefs[cv] - oldPrefs[cv];
      return pv;
    }, {});
    this.finalReports.push({
      round: this.threshRound,
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
    this.ballots = newBallots;
  };

  private winnersOnly = (vote: string[]): string[] =>
    vote.filter((name: string) => this.winners.has(name));

  private eliminateLoserThresh = (loser: string, votes: number) => {
    this.losers.add(loser);
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
    const oldPrefs = { ...this.currentPreferences };
    const changes = Object.keys(newPrefs).reduce((pv: any, cv: string) => {
      pv[cv] = newPrefs[cv] - oldPrefs[cv];
      return pv;
    }, {});
    this.threshReports.push({
      round: this.threshRound,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: loser,
          action: CandidateAction.eliminatedThresh,
          seats: 0,
          round: this.threshRound,
          votesTransferred: votes,
          changes,
        },
      ],
    });
    this.currentPreferences = newPrefs;
    this.ballots = newBallots;
  };

  private setWinnerThresh = (winner: string, votes: number) => {
    this.winners.add(winner);
    const votesTransferred = votes - this.thresh;
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
    this.threshReports.push({
      round: this.threshRound,
      results: this.currentPreferences,
      outcome: [
        {
          candidate: winner,
          action: CandidateAction.nextRound,
          seats: 0,
          round: this.threshRound,
          votesTransferred,
          changes,
        },
      ],
    });
    this.currentPreferences = newPrefs;
    this.ballots = newBallots;
  };
}
