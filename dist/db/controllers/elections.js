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
var connect_1 = __importDefault(require('../connect'));
var mongodb_1 = require('mongodb');
var moment_1 = __importDefault(require('moment'));
console.log('process.env.NODE_ENV', process.env.NODE_ENV);
var DATABASE_NAME = process.env.NODE_ENV === 'test' ? 'stv_test' : 'stv';
console.log('DATABASE_NAME', DATABASE_NAME);
var initElections = function() {
  return __awaiter(_this, void 0, void 0, function() {
    var _a, db, dbClose, dbElections;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, connect_1.default(DATABASE_NAME)];
        case 1:
          (_a = _b.sent()), (db = _a.db), (dbClose = _a.dbClose);
          dbElections = db.collection('elections');
          return [2, { dbElections: dbElections, dbClose: dbClose }];
      }
    });
  });
};
exports.dbCreateElection = function(data) {
  return __awaiter(_this, void 0, void 0, function() {
    var payload, _a, dbElections, dbClose, insertedId, err_1;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          payload = {
            title: data.title,
            subtitle: data.subtitle,
            electionStatus: data.electionStatus,
            resultsVisibility: data.resultsVisibility,
            electionType: data.electionType,
            seats: data.seats,
            pollsOpen: moment_1.default.isMoment(data.pollsOpen)
              ? data.pollsOpen.toISOString()
              : data.pollsOpen,
            pollsClose: moment_1.default.isMoment(data.pollsClose)
              ? data.pollsClose.toISOString()
              : data.pollsClose,
            voterIds: [],
            votes: [],
          };
          return [4, initElections()];
        case 1:
          (_a = _b.sent()),
            (dbElections = _a.dbElections),
            (dbClose = _a.dbClose);
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [4, dbElections.insertOne(payload)];
        case 3:
          insertedId = _b.sent().insertedId;
          dbClose();
          return [2, insertedId.toHexString()];
        case 4:
          err_1 = _b.sent();
          dbClose();
          return [2, Promise.reject(err_1)];
        case 5:
          return [2];
      }
    });
  });
};
exports.dbRetrieveElection = function(electionID) {
  return __awaiter(_this, void 0, void 0, function() {
    var _a, dbElections, dbClose, result, err_2;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, initElections()];
        case 1:
          (_a = _b.sent()),
            (dbElections = _a.dbElections),
            (dbClose = _a.dbClose);
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4,
            dbElections.findOne({ _id: new mongodb_1.ObjectID(electionID) }),
          ];
        case 3:
          result = _b.sent();
          dbClose();
          return [2, result];
        case 4:
          err_2 = _b.sent();
          dbClose();
          return [2, Promise.reject(err_2)];
        case 5:
          return [2];
      }
    });
  });
};
exports.dbUpdateElection = function(electionID, changes) {
  return __awaiter(_this, void 0, void 0, function() {
    var existing, _a, dbElections, dbClose, result, err_3;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          Object.keys(changes).forEach(function(key) {
            if (moment_1.default.isMoment(changes[key])) {
              changes[key] = changes[key].toISOString;
            }
          });
          return [4, exports.dbRetrieveElection(electionID)];
        case 1:
          existing = _b.sent();
          if (!existing) {
            return [
              2,
              Promise.reject(
                'Document with ObjectID ' +
                  electionID +
                  " does not exist in collection 'elections'"
              ),
            ];
          }
          return [4, initElections()];
        case 2:
          (_a = _b.sent()),
            (dbElections = _a.dbElections),
            (dbClose = _a.dbClose);
          _b.label = 3;
        case 3:
          _b.trys.push([3, 5, , 6]);
          return [
            4,
            dbElections.findOneAndUpdate(
              { _id: new mongodb_1.ObjectID(electionID) },
              { $set: changes },
              { returnOriginal: false }
            ),
          ];
        case 4:
          result = _b.sent();
          dbClose();
          return [2, result];
        case 5:
          err_3 = _b.sent();
          dbClose();
          return [2, Promise.reject(err_3)];
        case 6:
          return [2];
      }
    });
  });
};
exports.dbCastVote = function(electionID, voterId, vote) {
  return __awaiter(_this, void 0, void 0, function() {
    var _a, dbElections, dbClose, dbID, existingElection, result, err_4;
    return __generator(this, function(_b) {
      switch (_b.label) {
        case 0:
          return [4, initElections()];
        case 1:
          (_a = _b.sent()),
            (dbElections = _a.dbElections),
            (dbClose = _a.dbClose);
          dbID = new mongodb_1.ObjectID(electionID);
          _b.label = 2;
        case 2:
          _b.trys.push([2, 5, , 6]);
          return [
            4,
            dbElections.findOne(
              {
                _id: dbID,
              },
              {
                projection: {
                  voterIds: true,
                  pollsClose: true,
                  pollsOpen: true,
                },
              }
            ),
          ];
        case 3:
          existingElection = _b.sent();
          if (!existingElection) {
            dbClose();
            return [
              2,
              Promise.reject(
                'Election with electionID: ' + electionID + ' does not exist'
              ),
            ];
          }
          if (
            moment_1
              .default()
              .isBefore(moment_1.default(existingElection.pollsOpen))
          ) {
            dbClose();
            return [
              2,
              Promise.reject(
                'Your vote was not recorded, because polls have not yet opened for election ' +
                  electionID +
                  '. Try again at ' +
                  existingElection.pollsOpen +
                  ','
              ),
            ];
          }
          if (
            moment_1
              .default()
              .isAfter(moment_1.default(existingElection.pollsClose))
          ) {
            dbClose();
            return [
              2,
              Promise.reject(
                'Your vote was not recorded, because polls have closed for election ' +
                  electionID +
                  ' at ' +
                  existingElection.pollsClose +
                  ','
              ),
            ];
          }
          if (
            Array.isArray(existingElection.voterIds) &&
            existingElection.voterIds.includes(voterId)
          ) {
            dbClose();
            return [
              2,
              Promise.reject(
                'Voter: ' +
                  voterId +
                  ' has already cast a ballot in this election'
              ),
            ];
          }
          return [
            4,
            dbElections.findOneAndUpdate(
              { _id: dbID },
              {
                $push: {
                  votes: vote,
                  voterIds: voterId,
                },
              },
              { upsert: false }
            ),
          ];
        case 4:
          result = _b.sent();
          dbClose();
          return [2, result];
        case 5:
          err_4 = _b.sent();
          dbClose();
          return [2, Promise.reject(err_4)];
        case 6:
          return [2];
      }
    });
  });
};
exports.default = {
  dbCreateElection: exports.dbCreateElection,
  dbRetrieveElection: exports.dbRetrieveElection,
  dbUpdateElection: exports.dbUpdateElection,
  dbCastVote: exports.dbCastVote,
};
//# sourceMappingURL=elections.js.map
