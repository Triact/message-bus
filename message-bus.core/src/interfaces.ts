declare namespace interfaces {
    type MessageType = (string | symbol);

    interface IBus {
        publish<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) : void;
        send<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) : void;
    }

    export interface ITransport {
        publish<T>(msg: T, msgType: string, topic: string) : void;
        send<T>(msg: T, msgType: string, topic: string) : void;
    }

    interface IRouting {
        //routeToTopic<T>(messageType: interfaces.MessageType, topic: string): void;
        routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
        getDestination<T>(msg: T): { msgType: string, topic: string };
    }

    // const MEssagePurposes = {
    //     EVENT: 'event'
    // };
}

export { interfaces };
//export type MessageIdentifier = (string | symbol);
