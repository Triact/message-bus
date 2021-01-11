export type MessageType = (string | symbol);

export interface IBus {
    publish<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) : void;
    send<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) : void;
}

export interface ITransport {
    publish<T>(msg: T, msgType: string, topic: string) : void;
    send<T>(msg: T, msgType: string, topic: string) : void;
    createConsumers(): void;
}

export interface IRoutingConfiguration {
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
    getDestination<T>(msg: T): { msgType: string, topic: string };
}

export interface IHandlingConfiguration {
    handleMessages<T>(msgCtor: new(...args: any[]) => T, handler: IHandleMessages<T>) : void;
}

export interface IHandleMessages<T> {
    handle(msg: T) : void;
}

export class MessagePurposes {
    static readonly EVENT: string = 'event';
    static readonly COMMAND: string = 'command';
}

export class MessageMetadataKeys {
    static readonly MessagePurpose: string = 'MessagePurpose';
    static readonly MessageType: string = 'MessageType';
}
