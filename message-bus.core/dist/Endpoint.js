"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Bus_1 = require("./Bus");
const Routing_1 = require("./Routing");
const AWS = require("aws-sdk");
class Endpoint {
    constructor() {
        this.routing = new Routing_1.Routing();
        this.useTransport = (transport) => {
            this.transport = transport;
        };
        this.routes = (callback) => {
            callback(this.routing);
        };
        this.sendOnly = () => {
            return new Bus_1.default(this.transport, this.routing);
        };
        console.log('###', AWS.config.credentials.profile);
    }
}
exports.default = Endpoint;
//# sourceMappingURL=Endpoint.js.map