import { inject, injectable } from "inversify";
import { IProvideEndpointConfiguration } from "./configuration/EndpointConfiguration";
import { MessageHelper } from "./helpers/MessageHelper";
import * as interfaces from './interfaces';
import MessageContext from "./MessageContext";

@injectable()
export default class Bus implements interfaces.IBus {

    private _endpointConfigProvider: IProvideEndpointConfiguration;
    private _transportImplementation: interfaces.ITransportImplementation;
    private _messageHandlerProvider: interfaces.IProvideMessageHandlers;
    private _logger: interfaces.ILogger;

    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfigurationProvider: IProvideEndpointConfiguration,
        @inject(interfaces.TYPES.ITransportImplementation) transportImplementation: interfaces.ITransportImplementation,
        @inject(interfaces.TYPES.IProvideMessageHandlers) messageHandlerProvider: interfaces.IProvideMessageHandlers,
        @inject(interfaces.TYPES.ILogger) logger: interfaces.ILogger
    ) {    
        if (!endpointConfigurationProvider) throw new Error(`Argument 'endpointConfigurationProvider' cannot be null.`);
        if (!transportImplementation) throw new Error(`Argument 'transportImplementation' cannot be null.`);
        if (!messageHandlerProvider) throw new Error(`Argument 'messageHandlerProvider' cannot be null.`);

        this._endpointConfigProvider = endpointConfigurationProvider;
        this._transportImplementation = transportImplementation;
        this._messageHandlerProvider = messageHandlerProvider;
        this._logger = logger;
    }

    startListening = () => {
        this._logger.info('Bus start listening...');
        this._transportImplementation.startListening(this.handleMessage, this.createMessageContext);
    }

    publish = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.EVENT)) 
            throw new Error(`Only events can be published.`);

        populateMessageCallback(msg);

        const dest = this._endpointConfigProvider.routing.getDestination<T>(msg);
        let msgType = this.getMessageTypeAsString(dest.msgType);

        this._transportImplementation.publish(msg, msgType, dest.topic);
    }

    send = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => promise<void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.COMMAND))
            throw new Error(`Only command can be send.`)

        populateMessageCallback(msg);

        const dest = this._endpointConfigProvider.routing.getDestination<T>(msg);
        let msgType = this.getMessageTypeAsString(dest.msgType);

        this._transportImplementation.send(msg, msgType, dest.topic);
    }

    private handleMessage = (msgType: interfaces.MessageType, msg: any, context: interfaces.IMessageContext) => {
        let handlers = this._messageHandlerProvider.getHandlersForMessageType(msgType);        
        handlers.map(h => h.handle(msg, context));
    }

    private createMessageContext = () : MessageContext => {
        return new MessageContext(this);
    }

    private getMessageTypeAsString = (msgType: interfaces.MessageType) => {
        return typeof msgType === 'symbol' ? Symbol.keyFor(msgType) : msgType;
    }
}
