"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._event = void 0;
function _event(messageType) {
    console.log('DECORATOR: Factory invoked');
    return function (constructorFunction) {
        console.log("DECORATOR: decorating");
        Reflect.defineMetadata('MessagePurpose', 'event', constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);
        const data = Reflect.getMetadata('MessageType', constructorFunction.prototype);
        console.log(`data: ${data.toString()}`);
    };
}
exports._event = _event;
;
//# sourceMappingURL=messageDecorators.js.map