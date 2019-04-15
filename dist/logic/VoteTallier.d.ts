import Ballot from './Ballot';
import { ElectionType, IVoteTallier, IVotingRoundReport } from '../types';
export default class VoteTallier {
  private ballots;
  private electionType;
  private seats;
  private quota;
  private round;
  private reports;
  constructor(data: IVoteTallier);
  debug: () => {
    ballots: Ballot[];
    electionType: ElectionType;
    seats: number;
    quota: number;
    round: number;
    reports: IVotingRoundReport[];
  };
  private tallyVotes;
  private finalReport;
  private getInitialReport;
  private assignSeat;
  private assignSeatsByDefault;
  private eliminateLastCandidate;
}
//# sourceMappingURL=VoteTallier.d.ts.map
