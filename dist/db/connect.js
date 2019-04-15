'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var mongodb_1 = require('mongodb');
var config_1 = __importDefault(require('../config'));
var DEFAULT_DB = 'rcv_test';
var connect = function(dbName) {
  if (dbName === void 0) {
    dbName = DEFAULT_DB;
  }
  return new Promise(function(resolve, reject) {
    var client = new mongodb_1.MongoClient(
      config_1.default.MONGO_URL || 'mongodb://localhost:27017',
      { useNewUrlParser: true }
    );
    client.connect(function(err) {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        var connection = client.db(dbName);
        resolve({
          db: connection,
          dbClose: function() {
            return client.close();
          },
        });
      }
    });
  });
};
exports.default = connect;
//# sourceMappingURL=connect.js.map
