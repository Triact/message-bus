import { interfaces } from '../interfaces';

export function _event(messageType: interfaces.MessageType) {
    console.log('DECORATOR: Factory invoked')

    
    return function(constructorFunction: Function) {
        console.log("DECORATOR: decorating");        
        Reflect.defineMetadata('MessagePurpose', 'event', constructorFunction.prototype);
        Reflect.defineMetadata('MessageType', messageType, constructorFunction.prototype);

        const data = Reflect.getMetadata('MessageType', constructorFunction.prototype);
        console.log(`data: ${data.toString()}`);
    }
};
