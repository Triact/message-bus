"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routing = void 0;
class Routing {
    constructor() {
        this.routes = {};
    }
    routeToTopic(ctor, topic) {
        const msg = new ctor();
        const msgType = Reflect.getMetadata('MessageType', msg);
        console.log(`MessageType: ${msgType.toString()}`);
        this.routes[msgType] = topic;
    }
    getDestination(msg) {
        const msgType = Reflect.getMetadata('MessageType', msg);
        if (!(msgType in this.routes))
            throw Error(`Unknown messageType:${msgType.toString()}.`);
        return {
            msgType: msgType,
            topic: this.routes[msgType]
        };
    }
}
exports.Routing = Routing;
//# sourceMappingURL=Routing.js.map