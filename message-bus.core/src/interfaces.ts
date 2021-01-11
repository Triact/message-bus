declare namespace interfaces {
    type MessageType = (string | symbol);

    interface IBus {
        publish<T>(ctor: new (...args: any[]) => T, populateMessage: (m: T) => void): void;
    }

    export interface ITransport {
        publish<T>(msg: T, msgType: string, topic: string): void;
        createConsumers(): void;
    }

    interface IRouting {
        //routeToTopic<T>(messageType: interfaces.MessageType, topic: string): void;
        routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
        getDestination<T>(msg: T): { msgType: string, topic: string };
    }

    export interface IConsumerBase {

    }

    export interface IConsumer<TMessage> extends IConsumerBase {
        handle(msg: TMessage): Promise<void>;
    }
}

const implementations: any[] = [];

function GetImplementations(): any[] {
    return implementations;
}

function register(msg: string) {

    return function (constructorFunction: Function) {
        console.log('### register', constructorFunction);
        implementations.push(constructorFunction);
        //return ctor;
    }
}

export { interfaces, register, GetImplementations };
//export type MessageIdentifier = (string | symbol);
