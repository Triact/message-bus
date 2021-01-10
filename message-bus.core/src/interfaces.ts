//declare namespace interfaces {
    export type MessageType = (string | symbol);

    export interface IBus {
        publish<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) : void;
        send<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) : void;
    }

    export interface ITransport {
        publish<T>(msg: T, msgType: string, topic: string) : void;
        send<T>(msg: T, msgType: string, topic: string) : void;
    }

    export interface IRouting {
        routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
        getDestination<T>(msg: T): { msgType: string, topic: string };
    }

    export interface IHandleMessages<T> {
        handle<T>(msg: T) : void;
    }

    export class MessagePurposes {
        static readonly EVENT: string = 'event';
        static readonly COMMAND: string = 'command';
    }

    export class MessageMetadataKeys {
        static readonly MessagePurpose: string = 'MessagePurpose';
        static readonly MessageType: string = 'MessageType';
    }
//}

//export { interfaces };
