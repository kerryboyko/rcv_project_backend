export default class Ballot {
  public weight: number = 1.0;

  constructor(public candidates: string[]) {}

  public reallocateSurplus = (
    winningCandidate: string,
    surplusPercentage: number
  ) => {
    if (this.candidates[0] === winningCandidate) {
      this.weight = this.weight * surplusPercentage;
    }
    this.eliminateCandidate(winningCandidate);
  };

  public eliminateCandidate = (eliminatedCandidate: string) => {
    this.candidates = this.candidates.filter(
      (candidate: string) => candidate !== eliminatedCandidate
    );
  };
}
