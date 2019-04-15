export default class Ballot {
  candidates: string[];
  private weight;
  constructor(candidates: string[]);
  getWeight: () => number;
  assignElected: (winner: string, surplusPercentage: number) => void;
  eliminateCandidate: (eliminatedCandidate: string) => void;
  readBallot: () => {
    weight: number;
    candidates: string[];
  };
}
//# sourceMappingURL=Ballot.d.ts.map
