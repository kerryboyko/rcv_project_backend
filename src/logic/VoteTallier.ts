import Ballot from './Ballot';

export enum TallyType {
  InstantRunoff = 'Instant Runoff Election with One Winner',
  MultiSeat = 'Multi-Seat Election with Single Transferable Votes',
  DemocraticPrimary = 'Assignment of delegates in the Democratic Primary',
}

export type VoteRecord = string[][];
type VoteTuple = [string, number];

interface IElectedSeat {
  candidate: string;
  seats: number;
  round: number;
  votesTransferred: number;
}

interface IVotingRoundReport {
  round: number;
  results: {
    [key: string]: number;
  };
  eliminated?: IElectedSeat;
  elected?: IElectedSeat;
}

interface IVoteTallier {
  votes: VoteRecord;
  tallyType?: TallyType;
  seats?: number; // number of seats up for grabs OR number of total delegates;
}

export default class VoteTallier {
  private ballots: Ballot[];
  private tallyType: TallyType = TallyType.InstantRunoff;
  private seats: number = 1;
  private quota: number = 0;
  private round: number = 1;
  private reports: IVotingRoundReport[] = [];

  constructor(data: IVoteTallier) {
    this.ballots = data.votes.map((vote: string[]) => new Ballot(vote));
    if (data.seats) {
      this.seats = data.seats;
    }
    if (data.tallyType) {
      this.tallyType = data.tallyType;
    }
    this.quota = Math.floor(this.ballots.length / (this.seats + 1)) + 1;
  }

  public debug = () => {
    const { ballots, tallyType, seats, quota, round, reports } = this;
    return {
      ballots,
      tallyType,
      seats,
      quota,
      round,
      reports,
    };
  };

  // recursive
  private tallyVotes = (): void => {
    const initialReport: IVotingRoundReport = this.getInitialReport();
    const voteValues = Object.values(initialReport.results);
    const voteTotal = voteValues.reduce((pv, cv) => pv + cv, 0);
    // if we don't have enough votes to fill another seat, end;
    if (voteTotal < this.quota) {
      return this.finalReport(initialReport);
    } else if (voteValues.some((res: number) => res >= this.quota)) {
      this.assignSeat(initialReport);
    } else {
      this.eliminateLastCandidate(initialReport);
    }
    return this.tallyVotes();
  };

  private finalReport = (initialReport: IVotingRoundReport): void => {
    this.reports.push({ round: this.round, results: initialReport.results });
  };

  private getInitialReport = (): IVotingRoundReport => {
    // get this round's ballot in the form of a report
    this.ballots = this.ballots.filter(
      (ballot: Ballot) => ballot.candidates.length > 0
    );
    return this.ballots.reduce(
      (runningCount: IVotingRoundReport, currentBallot: Ballot) => {
        const candidate: string = currentBallot.candidates[0]; // this round's choice
        if (!runningCount.results[candidate]) {
          runningCount.results[candidate] = 0;
        }
        // currentBallot.weight is always 1 on the first ballot,
        // but could be a fraction if we're reassigning a surplus, proportionally.
        runningCount.results[candidate] += currentBallot.getWeight();
        return runningCount;
      },
      { round: this.round, results: {} }
    );
  };

  private assignSeat = (initialReport: IVotingRoundReport): void => {
    const { results } = initialReport;
    const report: IVotingRoundReport = { ...initialReport };
    const [winner, winnerCount] = Object.entries(results).reduce(
      ([prevCand, prevCount]: VoteTuple, [cand, count]: VoteTuple) => {
        return count > prevCount ? [cand, count] : [prevCand, prevCount];
      }
    );
    // we can assign multiple seats to the same candidate in a Dem Primary,
    // otherwise the max is 1.
    const seatsAssigned: number =
      this.tallyType === TallyType.DemocraticPrimary
        ? Math.floor(winnerCount / this.quota)
        : 1;


    const elected: IElectedSeat = {
      candidate: winner,
      round: this.round,
      seats: seatsAssigned,
      votesTransferred: winnerCount - seatsAssigned * this.quota,
    };
    // this, along with the existing weight, will determine the new weight of the ballot;
    const surplusPercentage: number = elected.votesTransferred / winnerCount;
    this.ballots.forEach(ballot =>
      ballot.assignElected(winner, surplusPercentage)
    );
    report.elected = elected;
    this.reports.push(report);
    this.round += 1; // increment the round;
  };

  private eliminateLastCandidate = (
    initialReport: IVotingRoundReport
  ): void => {
    const { results } = initialReport;
    const report = { ...initialReport };
    // find the candidates with the least votes;
    const [loser, loserVotes] = Object.entries(results).reduce(
      ([prevCand, prevCount]: VoteTuple, [cand, count]: VoteTuple) => {
        return count < prevCount ? [cand, count] : [prevCand, prevCount];
      }
    );
    const lost: IElectedSeat = {
      candidate: loser,
      votesTransferred: loserVotes,
      round: this.round,
      seats: 0,
    };
    report.eliminated = lost;
    this.reports.push(report);
    this.ballots.forEach(ballot => ballot.eliminateCandidate(loser));
    this.round += 1;
  };
}
