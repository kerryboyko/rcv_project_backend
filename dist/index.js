"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var init_1 = __importDefault(require("./server/init"));
var config_1 = __importDefault(require("./config"));
var SERVER_PORT = config_1.default.SERVER_PORT;
var server = init_1.default(parseInt(SERVER_PORT, 10));
console.log("App is running on port " + SERVER_PORT);
var shutDown = function () {
    console.log('Received kill signal, shutting down gracefully');
    server.close(function () {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
    setTimeout(function () {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
//# sourceMappingURL=index.js.map