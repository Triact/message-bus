import { interfaces as inversifyInterfaces } from 'inversify';
import MessageContext from './MessageContext';

export type MessageType = (string | symbol);
export type RouteDefinition<T> = { msgType: MessageType, topic: string, msgCtor: new (...args: any[]) => T };

export const TYPES = {
    IProvideEnpointConfiguration: Symbol.for('IProvideEndpointConfiguration'),
    Bus: Symbol.for('Bus'),
    ITransport: Symbol.for('ITransport'),
    ITransportImplementation: Symbol.for('ITransportImplementation'),
    MessageHandler: Symbol.for('MessageHandler'),
    IProvideMessageHandlers: Symbol.for('IProvideMessageHandlers')
}

// Endpoint Configuration
export interface IRoutingConfiguration extends IProvideRoutes {
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
    getDestination<T>(msg: T): { msgType: MessageType, topic: string };
}

export interface IHandlingConfiguration {
    handleMessages<T>(msgCtor: new (...args: any[]) => T, handlerCtor: new (...args: any[]) => IHandleMessages<T>): void;
}

// Providers
export interface IProvideRoutes {
    getRoutes(): RouteDefinition<IMessage>[];
}

// Bus
interface ISendMessages {
    send<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
} 

interface IPublishMessages {
    publish<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void;
}

export interface IBus extends ISendMessages, IPublishMessages {    
}

export interface ITransport {
    configure(container: inversifyInterfaces.Container) : void;
}

export interface ITransportConfiguration {
}

export interface ITransportImplementation {
    publish<T>(msg: T, msgType: string | undefined, topic: string): void;
    send<T>(msg: T, msgType: string | undefined, topic: string): void;
    startListening(messageHandler: (msgType: MessageType, msg: any, context: IMessageContext) => void, createMessageContextCallback: () => MessageContext): void;
}

export interface IProvideMessageHandlers {
    getHandlersForMessageType<T>(msgType: MessageType): IHandleMessages<T>[];
}

export interface IHandleMessages<T> {
    handle(msg: T, context: IMessageContext): Promise<void>;
}

export interface IMessageContext extends ISendMessages, IPublishMessages {
    messageHeaders: MessageHeaderMap
}

export type MessageHeaderMap = {[key: string]: string};

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
