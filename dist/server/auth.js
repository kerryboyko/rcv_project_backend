'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function(mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
var express_jwt_1 = __importDefault(require('express-jwt'));
var jwks_rsa_1 = __importDefault(require('jwks-rsa'));
var express_jwt_authz_1 = __importDefault(require('express-jwt-authz'));
var config_1 = __importDefault(require('../config'));
var AUTH0_AUDIENCE = config_1.default.AUTH0_AUDIENCE,
  AUTH0_DOMAIN = config_1.default.AUTH0_DOMAIN;
exports.jwtSecret = jwks_rsa_1.default.expressJwtSecret({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: 'https://' + AUTH0_DOMAIN + '/.well-known/jwks.json',
});
exports.checkJwt = express_jwt_1.default({
  secret: exports.jwtSecret,
  audience: AUTH0_AUDIENCE,
  issuer: 'https://' + AUTH0_DOMAIN + '/',
  algorithms: ['RS256'],
});
exports.checkScope = express_jwt_authz_1.default;
exports.checkRole = function(role) {
  return function(req, res, next) {
    var assignedRoles = req.user['http://localhost:4000/roles'];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    }
    return res.status(401).send('Insufficient Role');
  };
};
exports.default = {
  checkScope: exports.checkScope,
  checkJwt: exports.checkJwt,
  checkRole: exports.checkRole,
};
//# sourceMappingURL=auth.js.map
