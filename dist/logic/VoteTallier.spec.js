'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : new P(function(resolve) {
              resolve(result.value);
            }).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === 'function' &&
        (g[Symbol.iterator] = function() {
          return this;
        }),
      g
    );
    function verb(n) {
      return function(v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError('Generator is already executing.');
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y['return']
                  : op[0]
                  ? y['throw'] || ((t = y['return']) && t.call(y), 0)
                  : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
var _this = this;
Object.defineProperty(exports, '__esModule', { value: true });
var lodash_1 = require('lodash');
var VoteTallier_1 = __importDefault(require('./VoteTallier'));
var types_1 = require('../types');
var genVotes = function() {
  var votes = [];
  lodash_1.range(40).forEach(function() {
    votes.push(['a', 'b', 'c']);
  });
  lodash_1.range(42).forEach(function() {
    votes.push(['a', 'c', 'b']);
  });
  lodash_1.range(44).forEach(function() {
    votes.push(['b', 'a', 'c']);
  });
  lodash_1.range(46).forEach(function() {
    votes.push(['c', 'a', 'b']);
  });
  lodash_1.range(48).forEach(function() {
    votes.push(['c', 'b', 'a']);
  });
  return votes;
};
var genPrimary = function() {
  var votes = [];
  lodash_1.range(400).forEach(function() {
    votes.push(['a', 'b', 'c']);
  });
  lodash_1.range(420).forEach(function() {
    votes.push(['a', 'c', 'b']);
  });
  lodash_1.range(440).forEach(function() {
    votes.push(['b', 'a', 'c']);
  });
  lodash_1.range(460).forEach(function() {
    votes.push(['c', 'a', 'b']);
  });
  lodash_1.range(480).forEach(function() {
    votes.push(['c', 'b', 'a']);
  });
  lodash_1.range(400).forEach(function() {
    votes.push(['d', 'b', 'c']);
  });
  lodash_1.range(420).forEach(function() {
    votes.push(['d', 'c', 'b']);
  });
  lodash_1.range(440).forEach(function() {
    votes.push(['b', 'd', 'c']);
  });
  lodash_1.range(460).forEach(function() {
    votes.push(['c', 'd', 'b']);
  });
  lodash_1.range(480).forEach(function() {
    votes.push(['c', 'b', 'd']);
  });
  lodash_1.range(400).forEach(function() {
    votes.push(['d', 'e', 'c']);
  });
  lodash_1.range(420).forEach(function() {
    votes.push(['d', 'c', 'e']);
  });
  lodash_1.range(440).forEach(function() {
    votes.push(['e', 'd', 'c']);
  });
  lodash_1.range(460).forEach(function() {
    votes.push(['c', 'd', 'e']);
  });
  lodash_1.range(480).forEach(function() {
    votes.push(['c', 'e', 'd']);
  });
  lodash_1.range(400).forEach(function() {
    votes.push(['a', 'e', 'c']);
  });
  lodash_1.range(420).forEach(function() {
    votes.push(['a', 'f', 'b']);
  });
  lodash_1.range(440).forEach(function() {
    votes.push(['b', 'a', 'f']);
  });
  lodash_1.range(460).forEach(function() {
    votes.push(['f', 'a', 'b']);
  });
  lodash_1.range(480).forEach(function() {
    votes.push(['f', 'b', 'a']);
  });
  return votes;
};
var sample = genVotes();
var data = {};
describe('genVotes', function() {
  it('has the right lengths', function() {
    for (var _i = 0, sample_1 = sample; _i < sample_1.length; _i++) {
      var vote = sample_1[_i];
      expect(vote).toHaveLength(3);
    }
    expect(sample).toHaveLength(220);
  });
});
describe('class VoteTallier', function() {
  describe('VoteTallier.constructor()', function() {
    it('constructs a basic instant runoff vote', function() {
      data.test1 = new VoteTallier_1.default({ votes: sample });
      var results1 = data.test1.debug();
      expect(
        results1.ballots.map(function(ballot) {
          return ballot.candidates;
        })
      ).toEqual(sample);
      expect(results1.seats).toEqual(1);
      expect(results1.quota).toEqual(111);
    });
    it('constructs a multiseat vote', function() {
      data.test2 = new VoteTallier_1.default({
        votes: sample,
        electionType: types_1.ElectionType.MultiSeat,
        seats: 2,
      });
      var results2 = data.test2.debug();
      expect(
        results2.ballots.map(function(ballot) {
          return ballot.candidates;
        })
      ).toEqual(sample);
      expect(results2.seats).toEqual(2);
      expect(results2.quota).toEqual(74);
    });
  });
  describe('VoteTallier.getInitialReport', function() {
    it('calculates the value of a round', function() {
      var round = data.test1.getInitialReport();
      data.expected = {
        round: 1,
        results: {
          a: 82,
          b: 44,
          c: 94,
        },
      };
      expect(round).toEqual(data.expected);
    });
  });
  describe('VoteTallier.tallyVotes()', function() {
    it('correctly tallies Instant Runoff', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var reports;
        return __generator(this, function(_a) {
          data.test1.tallyVotes();
          reports = data.test1.debug().reports;
          expect(reports).toEqual([
            {
              round: 1,
              results: { a: 82, b: 44, c: 94 },
              outcome: {
                candidate: 'b',
                action: 'ELIMINATED - FEWEST VOTES',
                votesTransferred: 44,
                round: 1,
                seats: 0,
              },
            },
            {
              round: 2,
              results: { a: 126, c: 94 },
              outcome: {
                candidate: 'a',
                action: 'ELECTED - MET QUOTA',
                round: 2,
                seats: 1,
                votesTransferred: 15,
              },
            },
            { round: 3, results: { c: 108.99999999999996 } },
          ]);
          return [2];
        });
      });
    });
    it('correctly tallies STV', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var reports;
        return __generator(this, function(_a) {
          data.test2.tallyVotes();
          reports = data.test2.debug().reports;
          expect(reports).toEqual([
            {
              round: 1,
              results: { a: 82, b: 44, c: 94 },
              outcome: {
                candidate: 'c',
                action: 'ELECTED - MET QUOTA',
                round: 1,
                seats: 1,
                votesTransferred: 20,
              },
            },
            {
              round: 2,
              results: { a: 91.78723404255305, b: 54.21276595744666 },
              outcome: {
                candidate: 'a',
                action: 'ELECTED - MET QUOTA',
                round: 2,
                seats: 1,
                votesTransferred: 17.787234042553052,
              },
            },
            { round: 3, results: { b: 71.99999999999967 } },
          ]);
          return [2];
        });
      });
    });
  });
  describe('correctly works with a larger data set', function() {
    data.bigIRV = new VoteTallier_1.default({ votes: genPrimary() });
    data.bigSTV = new VoteTallier_1.default({
      votes: genPrimary(),
      electionType: types_1.ElectionType.MultiSeat,
      seats: 3,
    });
    data.bigPrimary = new VoteTallier_1.default({
      votes: genPrimary(),
      electionType: types_1.ElectionType.DemocraticPrimary,
      seats: 24,
    });
    it('works for IRV', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var reports;
        return __generator(this, function(_a) {
          data.bigIRV.tallyVotes();
          reports = data.bigIRV.debug().reports;
          expect(reports).toEqual([
            {
              round: 1,
              results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
              outcome: {
                candidate: 'e',
                action: 'ELIMINATED - FEWEST VOTES',
                votesTransferred: 440,
                round: 1,
                seats: 0,
              },
            },
            {
              round: 2,
              results: { a: 1640, b: 1320, c: 2820, d: 2080, f: 940 },
              outcome: {
                candidate: 'f',
                action: 'ELIMINATED - FEWEST VOTES',
                votesTransferred: 940,
                round: 2,
                seats: 0,
              },
            },
            {
              round: 3,
              results: { a: 2100, b: 1800, c: 2820, d: 2080 },
              outcome: {
                candidate: 'b',
                action: 'ELIMINATED - FEWEST VOTES',
                votesTransferred: 1800,
                round: 3,
                seats: 0,
              },
            },
            {
              round: 4,
              results: { a: 3460, c: 2820, d: 2520 },
              outcome: {
                candidate: 'd',
                action: 'ELIMINATED - FEWEST VOTES',
                votesTransferred: 2520,
                round: 4,
                seats: 0,
              },
            },
            {
              round: 5,
              results: { a: 3460, c: 5340 },
              outcome: {
                candidate: 'c',
                action: 'ELECTED - MET QUOTA',
                round: 5,
                seats: 1,
                votesTransferred: 939,
              },
            },
            { round: 6, results: { a: 3625.292134831411 } },
          ]);
          return [2];
        });
      });
    });
    it('works for STV', function() {
      data.bigSTV.tallyVotes();
      var reports = data.bigSTV.debug().reports;
      expect(reports).toEqual([
        {
          round: 1,
          results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 1,
            votesTransferred: 619,
          },
        },
        {
          round: 2,
          results: {
            a: 1740.9716312056798,
            b: 1530.7234042553318,
            d: 1841.9432624113597,
            e: 545.3617021276659,
            f: 940,
          },
          outcome: {
            candidate: 'e',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 545.3617021276659,
            round: 2,
            seats: 0,
          },
        },
        {
          round: 3,
          results: {
            a: 1740.9716312056798,
            b: 1530.7234042553318,
            d: 2387.304964538812,
            f: 940,
          },
          outcome: {
            candidate: 'd',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 1,
            votesTransferred: 186.30496453881187,
          },
        },
        {
          round: 4,
          results: { a: 1740.9716312056798, b: 1602.595908875287, f: 940 },
          outcome: {
            candidate: 'f',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 940,
            round: 4,
            seats: 0,
          },
        },
        {
          round: 5,
          results: { a: 2200.97163120568, b: 2082.595908875287 },
          outcome: {
            candidate: 'b',
            action: 'ELIMINATED - FEWEST VOTES',
            votesTransferred: 2082.595908875287,
            round: 5,
            seats: 0,
          },
        },
        {
          round: 6,
          results: { a: 3666.3333333333458 },
          outcome: {
            candidate: 'a',
            action: 'ELECTED - OTHER CANDIDATES ELIMINATED',
            round: 6,
            seats: 1,
            votesTransferred: 0,
          },
        },
        { round: 7, results: {} },
      ]);
    });
    it('works for a Primary', function() {
      var initialSeats = data.bigPrimary.debug().seats;
      data.bigPrimary.tallyVotes();
      var reports = data.bigPrimary.debug().reports;
      var totalDelegatesAssigned = reports.reduce(function(pv, cv) {
        if (
          !cv.outcome ||
          cv.outcome.action === types_1.CandidateAction.eliminated
        ) {
          return pv;
        }
        if (
          cv.outcome.action === types_1.CandidateAction.elected ||
          cv.outcome.action === types_1.CandidateAction.assigned
        ) {
          return pv + cv.outcome.seats;
        }
        return pv;
      }, 0);
      expect(totalDelegatesAssigned).toBe(initialSeats);
      expect(reports).toEqual([
        {
          round: 1,
          results: { a: 1640, b: 1320, c: 2820, d: 1640, e: 440, f: 940 },
          outcome: {
            candidate: 'c',
            action: 'ELECTED - MET QUOTA',
            round: 1,
            seats: 7,
            votesTransferred: 349,
          },
        },
        {
          round: 2,
          results: {
            a: 1696.9290780141682,
            b: 1438.8085106382914,
            d: 1753.8581560283365,
            e: 499.40425531915935,
            f: 940,
          },
          outcome: {
            candidate: 'd',
            action: 'ELECTED - MET QUOTA',
            round: 2,
            seats: 4,
            votesTransferred: 341.85815602833645,
          },
        },
        {
          round: 3,
          results: {
            a: 1696.9290780141682,
            b: 1609.7375886525047,
            e: 670.3333333333111,
            f: 940,
          },
          outcome: {
            candidate: 'a',
            action: 'ELECTED - MET QUOTA',
            round: 3,
            seats: 4,
            votesTransferred: 284.9290780141682,
          },
        },
        {
          round: 4,
          results: {
            b: 1756.981570100909,
            e: 737.4967950727031,
            f: 1010.5216348263618,
          },
          outcome: {
            candidate: 'b',
            action: 'ELECTED - MET QUOTA',
            round: 4,
            seats: 4,
            votesTransferred: 344.98157010090904,
          },
        },
        {
          round: 5,
          results: { e: 737.4967950727031, f: 1096.9151937728473 },
          outcome: {
            candidate: 'f',
            action: 'ELECTED - MET QUOTA',
            round: 5,
            seats: 3,
            votesTransferred: 37.91519377284726,
          },
        },
        {
          round: 6,
          results: { e: 737.4967950727031 },
          outcome: {
            candidate: 'e',
            action: 'ELECTED - MET QUOTA',
            round: 6,
            seats: 2,
            votesTransferred: 31.496795072703094,
          },
        },
        { round: 7, results: {} },
      ]);
    });
  });
});
//# sourceMappingURL=VoteTallier.spec.js.map
