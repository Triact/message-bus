"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
let Bus = class Bus {
    constructor(transport, routing) {
        this.publish = (ctor, populateMessage) => {
            const msg = new ctor();
            populateMessage(msg);
            const dest = this.routing.getDestination(msg);
            this.transport.publish(msg, dest.msgType.toString(), dest.topic);
        };
        this.transport = transport;
        this.routing = routing;
    }
};
Bus = __decorate([
    inversify_1.injectable()
], Bus);
exports.default = Bus;
//# sourceMappingURL=Bus.js.map