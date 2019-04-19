import {
  countValidBallots,
  countCurrentPrefs,
  findLeader,
  reduceIdenticalBallots,
  findLagger,
  countAllocations,
} from './tallierUtils';
import { BallotTuple, CandidateAction, IJeffersonTally } from '../types';
import cloneDeep from 'lodash/cloneDeep';
// magic numbers;
const DEM_MINIMUM_THRESH = 0.15;
const NH_DELEGATES = 24;

export default class DemTallier {
  public ballots: BallotTuple[];
  public thresh: number = 0;
  public losers: Set<string> = new Set();
  public reports: any[] = [];
  public round: number = 0;
  public currentPreferences: { [key: string]: number } = {};
  public delegateAssignments: IJeffersonTally = {};

  constructor(public readonly votes: string[][]) {
    this.ballots = reduceIdenticalBallots(
      votes.map((vote: string[]): BallotTuple => [vote, 1])
    );
    const validBallots: number = countValidBallots(this.ballots);
    this.thresh = Math.floor(validBallots * DEM_MINIMUM_THRESH);
  }

  public tally = (): IJeffersonTally => {
    this.ballots = reduceIdenticalBallots(this.ballots);
    this.currentPreferences = countCurrentPrefs(this.ballots);
    const allPassedThreshold = Object.values(this.currentPreferences).every(
      (voteAmount: number) => voteAmount > this.thresh
    );
    if (allPassedThreshold) {
      // base case;
      return this.assignDelegates(this.currentPreferences);
    }
    const [lagger, laggerVotes] = findLagger(this.currentPreferences);
    this.eliminateLoser(lagger, laggerVotes);
    return this.tally();
  };

  private eliminateLoser = (loser: string, loserVotes: number) => {
    this.round += 1;
    const newBallots = this.ballots.slice().map(
      (ballot: BallotTuple): BallotTuple => {
        const [vote, weight] = ballot;
        const newVote = vote.slice().filter((cand: string) => cand !== loser);
        return [newVote, weight];
      }
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
          votesTransferred: loserVotes,
          changes,
        },
      ],
    });
    this.currentPreferences = newPrefs;
    this.ballots = newBallots;
  };

  private convertPrefsToJefferson = (prefs: {
    [key: string]: number;
  }): IJeffersonTally => {
    const jTally: IJeffersonTally = {};
    Object.keys(prefs).forEach((candName: string) => {
      jTally[candName] = { seatsAllocated: 0, votes: prefs[candName] };
    });
    return jTally;
  };

  private calcEffectiveJeffersonCount = (
    jTally: IJeffersonTally
  ): { [key: string]: number } => {
    const effJeff: { [key: string]: number } = {};
    Object.keys(jTally).forEach((candName: string) => {
      effJeff[candName] =
        jTally[candName].votes / (jTally[candName].seatsAllocated + 1);
    });
    return effJeff;
  };

  private assignDelegates = (prefs: { [key: string]: number }) => {
    this.delegateAssignments = this.convertPrefsToJefferson(prefs);
    while (countAllocations(this.delegateAssignments) < NH_DELEGATES) {
      this.round += 1;
      const jCount = this.calcEffectiveJeffersonCount(this.delegateAssignments);
      const [leader] = findLeader(jCount);
      this.delegateAssignments[leader].seatsAllocated += 1;
      this.reports.push({
        round: this.round,
        results: cloneDeep(this.delegateAssignments),
        effectiveVotesForThisRound: jCount,
        outcome: [
          {
            candidate: leader,
            action: CandidateAction.delegateAwarded,
            remainingDelegates:
              NH_DELEGATES - countAllocations(this.delegateAssignments),
          },
        ],
      });
    }
    return this.delegateAssignments;
  };
}
