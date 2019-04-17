import Ballot from './Ballot';
import {
  CandidateAction,
  IElectedSeat,
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

const reduceIdenticalBallots = (ballots: Ballot[]) => {
  const count: { [key: string]: number } = ballots
    .filter((bal: Ballot) => bal.ballot.length > 0)
    .reduce((runningTotal: any, bal: Ballot) => {
      const stringified = JSON.stringify(bal.ballot);
      if (!runningTotal[stringified]) {
        runningTotal[stringified] = 0;
      }
      runningTotal[stringified] += bal.getWeight();
      return runningTotal;
    }, {});

  const output = Object.entries(count).map(([prefs, weight]: VoteTuple) => {
    console.log(JSON.parse(prefs));
    const consolidatedBallot = new Ballot(JSON.parse(prefs));
    consolidatedBallot.setWeight(weight);
    return consolidatedBallot;
  });
  return output;
};

const countCurrentPrefs = (ballots: Ballot[]): any => {
  const output = ballots
    .filter((bal: Ballot) => bal.ballot.length > 0)
    .reduce((pv: { [key: string]: number }, bal: Ballot) => {
      if (!pv[bal.ballot[0]]) {
        pv[bal.ballot[0]] = 0;
      }
      pv[bal.ballot[0]] += bal.getWeight();
      return pv;
    }, {});
  return output;
};

export default class DemTallier {
  public quota: number = 0;
  public thresh: number = 0;
  public round: number = 1;
  public reports: IVotingRoundReport[] = [];
  public elected: Set<string> = new Set();
  public eliminated: Set<string> = new Set();
  private ballots: Ballot[];
  private delegates: number = NH_DELEGATES;

  constructor(public readonly votes: string[][]) {
    const validVotes = votes.filter(vote => vote.length > 0);
    this.ballots = reduceIdenticalBallots(
      validVotes.map((vote: string[]) => new Ballot(vote))
    );
    const votesCast: number = votes.length;
    this.quota = droopQuota(votesCast, NH_DELEGATES);
    this.thresh = votesCast * MINIMUM_THRESH;
  }

  public tallyVotes = (): IVotingRoundReport[] => {
    const initialReport: IVotingRoundReport = this.getInitialReport();
    this.quickAssignFirstRoundDelegates(initialReport);

    return this.recursiveTallyVotes();
  };

  private quickAssignFirstRoundDelegates = (
    report: IVotingRoundReport
  ): void => {
    const assignments = Object.entries(report.results)
      .filter(([_c, v]: VoteTuple) => v >= this.thresh)
      .reduce((pv: any, [candName, votes]: VoteTuple) => {
        this.elected.add(candName);
        const seats = Math.floor(votes / this.quota);
        const remaining = votes - this.quota * seats;
        return { ...pv, [candName]: { seats, remaining } };
      }, {});
    const electeds = Object.keys(assignments).map((winner: string) => ({
      candidate: winner,
      action: CandidateAction.elected,
      round: this.round,
      seats: assignments[winner].seats,
      votesTransferred: assignments[winner].remaining,
    }));

    electeds.forEach(({ candidate, seats, votesTransferred }: IElectedSeat) => {
      const surplusPercentage =
        votesTransferred / (seats * this.quota + votesTransferred);
      this.ballots.forEach(ballot => {
        ballot.assignElected(candidate, surplusPercentage);
      });
    });

    report.outcome = electeds;
    const delegatesAssigned: number = electeds.reduce(
      (pv, cv) => pv + cv.seats,
      0
    );
    console.log(JSON.stringify({ report }, null, 2));

    this.reports.push(report);
    this.round += 1;
    this.delegates -= delegatesAssigned;
  };

  private getInitialReport = (): IVotingRoundReport => {
    // get this round's ballot in the form of a report
    // kill the exhausted votes;
    return { round: this.round, results: countCurrentPrefs(this.ballots) };
  };

  private recursiveTallyVotes = (): IVotingRoundReport[] => {
    console.log('recursiveTallyVotes');
    this.ballots = reduceIdenticalBallots(this.ballots);
    console.log(
      this.ballots.map((bal: Ballot) => ({
        ballot: bal.ballot,
        weight: bal.getWeight(),
      }))
    );
    const initialReport: IVotingRoundReport = this.getInitialReport();
    if (this.delegates <= 0) {
      // if we've already assigned all the seats,
      return this.finalReport(initialReport);
    }
    const [leader, leaderVotes]: VoteTuple = findLeader(initialReport.results);
    const [lagger, laggerVotes]: VoteTuple = findLagger(initialReport.results);
    const allVotesLeft: number = Object.values(initialReport.results).reduce(
      (pv, cv) => pv + cv,
      0
    );
    if (leaderVotes >= this.thresh) {
      console.log(`${leader} elected`, 'leaderVotes >= this.thresh');
      this.elected.add(leader);
      this.assignDelegates(initialReport, leader, leaderVotes);
      return this.recursiveTallyVotes();
    } else if (leaderVotes >= this.quota && this.elected.has(leader)) {
      console.log('leaderVotes >= this.quota && this.elected.has(leader)');
      this.assignDelegates(initialReport, leader, laggerVotes);
      return this.recursiveTallyVotes();
    }
    if (allVotesLeft < this.thresh && this.delegates > 0) {
      console.log('this.delegates', this.delegates);
      // return this.recursiveTallyVotes();
      throw new Error('Edge case');
    } else {
      console.log(`${lagger} eliminated`, 'else');
      this.eliminated.add(lagger);
      this.eliminateLastCandidate(initialReport, lagger, laggerVotes);
    }
    return this.recursiveTallyVotes();
  };

  private finalReport = (
    initialReport: IVotingRoundReport
  ): IVotingRoundReport[] => {
    console.log({ round: this.round, results: initialReport.results });

    this.reports.push({ round: this.round, results: initialReport.results });
    return this.reports;
  };

  private assignDelegates = (
    report: IVotingRoundReport,
    winner: string,
    winnerVotes: number
  ): IVotingRoundReport => {
    const delegatesAssigned = Math.floor(winnerVotes / this.quota);
    const elected: IElectedSeat = {
      candidate: winner,
      action: CandidateAction.elected,
      round: this.round,
      seats: delegatesAssigned,
      votesTransferred: winnerVotes - delegatesAssigned * this.quota,
    };
    const surplusPercentage: number = elected.votesTransferred / winnerVotes;
    this.ballots.forEach(ballot =>
      ballot.assignElected(winner, surplusPercentage)
    );
    report.outcome = [elected];
    console.log({ report });

    this.reports.push(report);
    this.round += 1;
    this.delegates -= delegatesAssigned;
    return report;
  };

  private eliminateLastCandidate = (
    report: IVotingRoundReport,
    loser: string,
    loserVotes: number
  ): IVotingRoundReport => {
    const lost: IElectedSeat = {
      candidate: loser,
      action: CandidateAction.eliminated,
      votesTransferred: loserVotes,
      round: this.round,
      seats: 0,
    };
    report.outcome = [lost];
    console.log({ report });
    this.reports.push(report);
    this.ballots.forEach(ballot => ballot.eliminateCandidate(loser));
    this.round += 1;
    return report;
  };
}
