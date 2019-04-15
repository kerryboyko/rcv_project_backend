'use strict';
var __assign =
  (this && this.__assign) ||
  function() {
    __assign =
      Object.assign ||
      function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var Ballot_1 = __importDefault(require('./Ballot'));
var types_1 = require('../types');
var ZERO_PERCENT = 0.0;
var VoteTallier = (function() {
  function VoteTallier(data) {
    var _this = this;
    this.electionType = types_1.ElectionType.InstantRunoff;
    this.seats = 1;
    this.quota = 0;
    this.round = 1;
    this.reports = [];
    this.debug = function() {
      var _a = _this,
        ballots = _a.ballots,
        electionType = _a.electionType,
        seats = _a.seats,
        quota = _a.quota,
        round = _a.round,
        reports = _a.reports;
      return {
        ballots: ballots,
        electionType: electionType,
        seats: seats,
        quota: quota,
        round: round,
        reports: reports,
      };
    };
    this.tallyVotes = function() {
      var initialReport = _this.getInitialReport();
      if (_this.seats <= 0 || Object.keys(initialReport.results).length === 0) {
        return _this.finalReport(initialReport);
      }
      var voteValues = Object.values(initialReport.results);
      if (voteValues.length === _this.seats) {
        _this.assignSeatsByDefault(initialReport);
      } else if (
        voteValues.some(function(res) {
          return res >= _this.quota;
        })
      ) {
        _this.assignSeat(initialReport);
      } else {
        _this.eliminateLastCandidate(initialReport);
      }
      _this.tallyVotes();
    };
    this.finalReport = function(initialReport) {
      _this.reports.push({
        round: _this.round,
        results: initialReport.results,
      });
    };
    this.getInitialReport = function() {
      _this.ballots = _this.ballots.filter(function(ballot) {
        return ballot.candidates.length > 0;
      });
      return _this.ballots.reduce(
        function(runningCount, currentBallot) {
          var candidate = currentBallot.candidates[0];
          if (!runningCount.results[candidate]) {
            runningCount.results[candidate] = 0;
          }
          runningCount.results[candidate] += currentBallot.getWeight();
          return runningCount;
        },
        { round: _this.round, results: {} }
      );
    };
    this.assignSeat = function(initialReport) {
      var results = initialReport.results;
      var report = __assign({}, initialReport);
      var _a = Object.entries(results).reduce(function(_a, _b) {
          var prevCand = _a[0],
            prevCount = _a[1];
          var cand = _b[0],
            count = _b[1];
          return count > prevCount ? [cand, count] : [prevCand, prevCount];
        }),
        winner = _a[0],
        winnerCount = _a[1];
      var seatsAssigned =
        _this.electionType === types_1.ElectionType.DemocraticPrimary
          ? Math.floor(winnerCount / _this.quota)
          : 1;
      var elected = {
        candidate: winner,
        action: types_1.CandidateAction.elected,
        round: _this.round,
        seats: seatsAssigned,
        votesTransferred: winnerCount - seatsAssigned * _this.quota,
      };
      var surplusPercentage = elected.votesTransferred / winnerCount;
      _this.ballots.forEach(function(ballot) {
        return ballot.assignElected(winner, surplusPercentage);
      });
      report.outcome = elected;
      _this.reports.push(report);
      _this.round += 1;
      _this.seats += -1;
    };
    this.assignSeatsByDefault = function(initialReport) {
      var results = initialReport.results;
      var report = __assign({}, initialReport);
      var winner = Object.entries(results).reduce(function(_a, _b) {
        var prevCand = _a[0],
          prevCount = _a[1];
        var cand = _b[0],
          count = _b[1];
        return count > prevCount ? [cand, count] : [prevCand, prevCount];
      })[0];
      var defaultElected = {
        candidate: winner,
        action: types_1.CandidateAction.assigned,
        round: _this.round,
        seats: 1,
        votesTransferred: 0,
      };
      _this.ballots.forEach(function(ballot) {
        return ballot.assignElected(winner, ZERO_PERCENT);
      });
      report.outcome = defaultElected;
      _this.reports.push(report);
      _this.round += 1;
      _this.seats += -1;
    };
    this.eliminateLastCandidate = function(initialReport) {
      var results = initialReport.results;
      var report = __assign({}, initialReport);
      var _a = Object.entries(results).reduce(function(_a, _b) {
          var prevCand = _a[0],
            prevCount = _a[1];
          var cand = _b[0],
            count = _b[1];
          return count < prevCount ? [cand, count] : [prevCand, prevCount];
        }),
        loser = _a[0],
        loserVotes = _a[1];
      var lost = {
        candidate: loser,
        action: types_1.CandidateAction.eliminated,
        votesTransferred: loserVotes,
        round: _this.round,
        seats: 0,
      };
      report.outcome = lost;
      _this.reports.push(report);
      _this.ballots.forEach(function(ballot) {
        return ballot.eliminateCandidate(loser);
      });
      _this.round += 1;
    };
    this.ballots = data.votes.map(function(vote) {
      return new Ballot_1.default(vote);
    });
    if (data.seats) {
      this.seats = data.seats;
    }
    if (data.electionType) {
      this.electionType = data.electionType;
    }
    this.quota = Math.floor(this.ballots.length / (this.seats + 1)) + 1;
  }
  return VoteTallier;
})();
exports.default = VoteTallier;
//# sourceMappingURL=VoteTallier.js.map
