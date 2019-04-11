import Ballot from './Ballot';

type VoteRecord = string[][];

interface IVotingRoundReport {
  round: number;
  results: {
    [key: string]: number;
  };
}

export enum TallyType {
  InstantRunoff,
  MultiSeat,
  DemocraticPrimary,
}

interface IVoteTallier {
  votes: VoteRecord;
  tallyType?: TallyType;
  seats?: number; // number of seats up for grabs OR number of total delegates;
}

export default class VoteTallier {
  public ballots: Ballot[];
  public tallyType: TallyType = TallyType.InstantRunoff;
  public seats: number = 1;
  public quota: number = 0;
  public round: number = 1; 
  public reports: IVotingRoundReport[] = []; 

  constructor(data: IVoteTallier) {
    this.ballots = data.votes.map((vote: string[]) => new Ballot(vote));
    if (data.seats) {
      this.seats = data.seats;
    }
    this.calcQuota();
  }

  public tallyVotes = () => {
    if (this.tallyType !== TallyType.DemocraticPrimary) {
      return this.tallyVotesSTV();
    } else {
      return null; 
    }
  };

  private getRound = ():IVotingRoundReport => {
    return this.ballots.reduce(
      (runningCount: IVotingRoundReport, currentBallot: Ballot) => {
        const candidate: string = currentBallot.candidates[0];
        if (!runningCount.results[candidate]) {
          runningCount.results[candidate] = 0;
        }
        runningCount.results[candidate] += currentBallot.weight;
        return runningCount;
      },
      {round: this.round, results: {}}
    );
  };

  private tallyVotesSTV = () => {
    const report:IVotingRoundReport = this.getRound(); 
    this.reports.push(report);
    console.log(JSON.stringify(report, null, 2)); 
    return report;
  };
  private calcQuota = () => {
    // uses the Droop Quota to determine the quota;
    this.quota = Math.floor(this.ballots.length / (this.seats + 1)) + 1;
  };
}
