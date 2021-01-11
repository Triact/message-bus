export type MessageType = (string | symbol);
export type RouteDefinition = { msgType: MessageType, topic: string };

export interface IBus {
    publish<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
    send<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
}

export interface ITransport {
    publish<T>(msg: T, msgType: string, topic: string): void;
    send<T>(msg: T, msgType: string, topic: string): void;
    createConsumers(routesProvides: IProvideRoutes, handlerProvider: IProvideMessageHandler): void;
}

export interface IRoutingConfiguration extends IProvideRoutes {
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
    getDestination<T>(msg: T): { msgType: string, topic: string };
}

export interface IProvideRoutes {
    getRoutes(): RouteDefinition[];
}

export interface IHandlingConfiguration extends IProvideMessageHandler {
    handleMessages<T>(msgCtor: new (...args: any[]) => T, handler: IHandleMessages<T>): void;
}

export interface IProvideMessageHandler {
    getHandler(msgType: MessageType): any;
}

export interface IHandleMessages<T> {
    handle(msg: T): Promise<void>;
}

export class MessagePurposes {
    static readonly EVENT: string = 'event';
    static readonly COMMAND: string = 'command';
}

export class MessageMetadataKeys {
    static readonly MessagePurpose: string = 'MessagePurpose';
    static readonly MessageType: string = 'MessageType';
}
