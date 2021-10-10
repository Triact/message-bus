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
    IProvideMessageHandlers: Symbol.for('IProvideMessageHandlers'),
    ILogger: Symbol.for('ILogger')
}

// Endpoint Configuration
export interface IRoutingConfiguration { //extends IProvideRoutes {
    routeToEndpoint<T>(ctor: new (...args: any[]) => T, queue: string): void;
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
}

export interface IHandlingConfiguration {
    handleMessages<T>(msgCtor: new (...args: any[]) => T, handlerCtor: new (...args: any[]) => IHandleMessages<T>): void;
}

// Providers
export interface IProvideRoutes {
    getRoutes(): RouteDefinition<IMessage>[];
    getDestination<T>(msg: T): { msgType: MessageType, topic: string };
}

// Bus
interface ISendMessages {
    send<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): Promise<void>;
} 

interface IPublishMessages {
    publish<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): Promise<void>;
}

export interface IBus extends ISendMessages, IPublishMessages {    
}

// Transports
export interface ITransport {
}

export interface ITransportConfiguration {
}

export interface ITransportConfigurationVisitor {
    configureTransport(callback: (container: inversifyInterfaces.Container) => void) : void;
}


export interface ITransportImplementation {
    publish<T>(msg: T, msgType: string | undefined, topic: string): Promise<void>;
    send<T>(msg: T, msgType: string | undefined, queue: string): Promise<void>;
    startListening(messageHandler: (msgType: MessageType, msg: any, context: IMessageContext) => Promise<void>, createMessageContextCallback: () => MessageContext): void;
}

// Message Handling
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

// Logging
export interface ILogger {
    debug(text:string, ...data:any[]) : void;
    info(text:string, ...data:any[]) : void;
    warning(text:string, ...data:any[]) : void;
    error(text:string, ...data:any[]) : void;
    fatal(text:string, ...data:any[]) : void;
}