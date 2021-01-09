import { interfaces } from '../interfaces';

export function event(messageType: interfaces.MessageType) {
    
    return function(constructorFunction: Function) {
        Reflect.defineMetadata('MessagePurpose', 'event', constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);
    }
};

export function command(messageType: interfaces.MessageType) {
    
    return function(constructorFunction: Function) {
        Reflect.defineMetadata('MessagePurpose', 'command', constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);
    }
}
