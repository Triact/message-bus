import * as interfaces from '../interfaces';

export function event(messageType: interfaces.MessageType) {
    
    return function(constructorFunction: Function) {
        Reflect.defineMetadata('MessagePurpose', interfaces.MessagePurposes.EVENT, constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);
    }
};

export function command(messageType: interfaces.MessageType) {
    
    return function(constructorFunction: Function) {
        Reflect.defineMetadata('MessagePurpose', interfaces.MessagePurposes.COMMAND, constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);
    }
}
