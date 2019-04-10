"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var morgan_1 = __importDefault(require("morgan"));
var auth_1 = require("./auth");
var user_1 = __importDefault(require("./api/v1/user"));
var runServer = function (port) {
    var app = express_1.default();
    app.use(body_parser_1.default.json());
    app.use(function (_, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        next();
    });
    app.use(body_parser_1.default.json({ type: 'application/*+json' }));
    app.use(morgan_1.default('dev'));
    app.get('/public', function (_, res) {
        res.json({
            message: 'Hello from a public API!',
        });
    });
    app.get('/private', auth_1.checkJwt, function (_, res) {
        res.json({
            message: 'Hello from a private API!',
        });
    });
    app.get('/admin', auth_1.checkJwt, auth_1.checkRole('admin'), function (_, res) {
        res.json({
            message: 'Hello from an admin-only API!',
        });
    });
    user_1.default(app);
    return app.listen(port);
};
exports.default = runServer;
//# sourceMappingURL=init.js.map