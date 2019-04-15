'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var Ballot = (function() {
  function Ballot(candidates) {
    var _this = this;
    this.candidates = candidates;
    this.weight = 1.0;
    this.getWeight = function() {
      return _this.weight;
    };
    this.assignElected = function(winner, surplusPercentage) {
      if (_this.candidates[0] === winner) {
        _this.weight = _this.weight * surplusPercentage;
      }
      _this.eliminateCandidate(winner);
    };
    this.eliminateCandidate = function(eliminatedCandidate) {
      _this.candidates = _this.candidates.filter(function(candidate) {
        return candidate !== eliminatedCandidate;
      });
    };
    this.readBallot = function() {
      return { weight: _this.weight, candidates: _this.candidates };
    };
  }
  return Ballot;
})();
exports.default = Ballot;
//# sourceMappingURL=Ballot.js.map
