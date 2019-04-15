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
var moment_1 = __importDefault(require('moment'));
var elections_1 = require('./elections');
var types_1 = require('../../types');
var mongodb_1 = require('mongodb');
var testElection = {
  title: 'Test Election',
  subtitle: 'testing the database',
  electionStatus: types_1.ElectionStatus.DRAFT,
  resultsVisibility: types_1.ElectionResultsVisibility.LIVE,
  electionType: types_1.ElectionType.DemocraticPrimary,
  seats: 10,
  pollsOpen: moment_1.default().toISOString(),
  pollsClose: moment_1
    .default()
    .add({ hours: 24 })
    .toISOString(),
};
var data = {};
describe('db/controllers/elections.ts', function() {
  describe('dbCreateElection()', function() {
    it('saves a new election', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var _a;
        return __generator(this, function(_b) {
          switch (_b.label) {
            case 0:
              _a = data;
              return [4, elections_1.dbCreateElection(testElection)];
            case 1:
              _a.testElectionID = _b.sent();
              expect(typeof data.testElectionID).toBe('string');
              expect(data.testElectionID).toHaveLength(24);
              return [2];
          }
        });
      });
    });
  });
  describe('dbRetrieveElection()', function() {
    it('retrieves the election we just created', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 1:
              result = _a.sent();
              expect(result).toEqual(
                __assign({}, testElection, {
                  _id: new mongodb_1.ObjectID(data.testElectionID),
                  votes: [],
                  voterIds: [],
                })
              );
              return [2];
          }
        });
      });
    });
  });
  describe('dbUpdateElection()', function() {
    it('updates an election', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1.dbUpdateElection(data.testElectionID, {
                  electionStatus: types_1.ElectionStatus.IN_PROGRESS,
                }),
              ];
            case 1:
              _a.sent();
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result = _a.sent();
              expect(result).toEqual(
                __assign({}, testElection, {
                  electionStatus: 'IN_PROGRESS',
                  _id: new mongodb_1.ObjectID(data.testElectionID),
                  votes: [],
                  voterIds: [],
                })
              );
              return [2];
          }
        });
      });
    });
  });
  describe('dbCastVote', function() {
    it('casts a vote', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1.dbCastVote(data.testElectionID, 'FIRST', [
                  'ALPHA',
                  'BETA',
                  'GAMMA',
                ]),
              ];
            case 1:
              _a.sent();
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result = _a.sent();
              expect(result.voterIds).toEqual(['FIRST']);
              expect(result.votes).toEqual([['ALPHA', 'BETA', 'GAMMA']]);
              return [2];
          }
        });
      });
    });
    it('casts another vote', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1.dbCastVote(data.testElectionID, 'SECOND', [
                  'BETA',
                  'ALPHA',
                  'DELTA',
                ]),
              ];
            case 1:
              _a.sent();
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result = _a.sent();
              expect(result.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
              expect(result.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
              expect(result.voterIds).toContain('FIRST');
              expect(result.voterIds).toContain('SECOND');
              return [2];
          }
        });
      });
    });
    it('does not let the voter cast twice', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1
                  .dbCastVote(data.testElectionID, 'FIRST', [
                    'ALPHA',
                    'BETA',
                    'GAMMA',
                    'DELTA',
                  ])
                  .catch(function(errMsg) {
                    data.errMsg = errMsg;
                  }),
              ];
            case 1:
              _a.sent();
              expect(data.errMsg).toBe(
                'Voter: FIRST has already cast a ballot in this election'
              );
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result = _a.sent();
              expect(result.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
              expect(result.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
              expect(result.votes).not.toContainEqual([
                'ALPHA',
                'BETA',
                'GAMMA',
                'DELTA',
              ]);
              expect(result.voterIds).toContain('FIRST');
              expect(result.voterIds).toContain('SECOND');
              return [2];
          }
        });
      });
    });
    it('does not let the voter vote after the poll has closed', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result1, result2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1.dbUpdateElection(data.testElectionID, {
                  pollsClose: moment_1
                    .default()
                    .subtract({ minutes: 30 })
                    .toISOString(),
                }),
              ];
            case 1:
              _a.sent();
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result1 = _a.sent();
              expect(
                moment_1
                  .default(result1.pollsClose)
                  .isBefore(moment_1.default())
              ).toBe(true);
              return [
                4,
                elections_1
                  .dbCastVote(data.testElectionID, 'LATE', [
                    'ALPHA',
                    'BETA',
                    'GAMMA',
                    'DELTA',
                  ])
                  .catch(function(errMsg) {
                    data.errMsg2 = errMsg;
                  }),
              ];
            case 3:
              _a.sent();
              expect(data.errMsg2.substring(0, 66)).toBe(
                'Your vote was not recorded, because polls have closed for election'
              );
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 4:
              result2 = _a.sent();
              expect(result2.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
              expect(result2.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
              expect(result2.votes).not.toContainEqual([
                'ALPHA',
                'BETA',
                'GAMMA',
                'DELTA',
              ]);
              expect(result2.voterIds).toContain('FIRST');
              expect(result2.voterIds).toContain('SECOND');
              expect(result2.voterIds).not.toContain('LATE');
              return [2];
          }
        });
      });
    });
    it('does not let the voter vote early', function() {
      return __awaiter(_this, void 0, void 0, function() {
        var result1, result2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [
                4,
                elections_1.dbUpdateElection(data.testElectionID, {
                  pollsClose: moment_1
                    .default()
                    .add({ hours: 12 })
                    .toISOString(),
                  pollsOpen: moment_1
                    .default()
                    .add({ hours: 6 })
                    .toISOString(),
                }),
              ];
            case 1:
              _a.sent();
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 2:
              result1 = _a.sent();
              expect(
                moment_1.default(result1.pollsOpen).isAfter(moment_1.default())
              ).toBe(true);
              return [
                4,
                elections_1
                  .dbCastVote(data.testElectionID, 'EARLY', [
                    'ALPHA',
                    'BETA',
                    'GAMMA',
                    'DELTA',
                  ])
                  .catch(function(errMsg) {
                    data.errMsg2 = errMsg;
                  }),
              ];
            case 3:
              _a.sent();
              expect(data.errMsg2.substring(0, 61)).toBe(
                'Your vote was not recorded, because polls have not yet opened'
              );
              return [4, elections_1.dbRetrieveElection(data.testElectionID)];
            case 4:
              result2 = _a.sent();
              expect(result2.votes).toContainEqual(['ALPHA', 'BETA', 'GAMMA']);
              expect(result2.votes).toContainEqual(['BETA', 'ALPHA', 'DELTA']);
              expect(result2.votes).not.toContainEqual([
                'ALPHA',
                'BETA',
                'GAMMA',
                'DELTA',
              ]);
              expect(result2.voterIds).toContain('FIRST');
              expect(result2.voterIds).toContain('SECOND');
              expect(result2.voterIds).not.toContain('EARLY');
              return [2];
          }
        });
      });
    });
  });
});
//# sourceMappingURL=elections.spec.js.map
