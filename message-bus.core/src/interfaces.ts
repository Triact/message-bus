export type MessageType = (string | symbol);
export type RouteDefinition<T> = { msgType: MessageType, topic: string, msgCtor: new (...args: any[]) => T };

export const TYPES = {
    IProvideEnpointConfiguration: Symbol.for('IProvideEndpointConfiguration'),
    Bus: Symbol.for('Bus')
}

// Endpoint Configuration
export interface IRoutingConfiguration extends IProvideRoutes {
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
    getDestination<T>(msg: T): { msgType: string, topic: string };
}

export interface IHandlingConfiguration extends IProvideMessageHandlers {
    handleMessages<T>(msgCtor: new (...args: any[]) => T, handler: IHandleMessages<T>): void;
}

// Providers
export interface IProvideRoutes {
    getRoutes(): RouteDefinition<IMessage>[];
}

// Bus
export interface IBus {
    publish<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
    send<T>(ctor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
}

export interface ITransport {
    publish<T>(msg: T, msgType: string, topic: string): void;
    send<T>(msg: T, msgType: string, topic: string): void;
    createConsumers(routesProvides: IProvideRoutes, handlerProvider: IProvideMessageHandlers): void;
}

export interface IProvideMessageHandlers {
    getHandlersForMessageType<T>(msgCtor: new (...args: any[]) => T, msgType: MessageType): IHandleMessages<T>[];
}

export interface IHandleMessages<T> {
    handle(msg: T): Promise<void>;
}

export interface IMessage {

}

export class MessagePurposes {
    static readonly EVENT: string = 'event';
    static readonly COMMAND: string = 'command';
}

export class MessageMetadataKeys {
    static readonly MessagePurpose: string = 'MessagePurpose';
    static readonly MessageType: string = 'MessageType';
}
