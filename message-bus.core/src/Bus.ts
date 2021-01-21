import { inject, injectable } from "inversify";
import { IProvideEndpointConfiguration } from "./configuration/EndpointConfiguration";
import { MessageHelper } from "./helpers/MessageHelper";
import * as interfaces from './interfaces';

@injectable()
export default class Bus implements interfaces.IBus {

    private _endpointConfigProvider: IProvideEndpointConfiguration;
    private _transportImplementation: interfaces.ITransportImplementation;
    private _messageHandlerProvider: interfaces.IProvideMessageHandlers;

    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfigurationProvider: IProvideEndpointConfiguration,
        @inject(interfaces.TYPES.ITransportImplementation) transportImplementation: interfaces.ITransportImplementation,
        @inject(interfaces.TYPES.IProvideMessageHandlers) messageHandlerProvider: interfaces.IProvideMessageHandlers
    ) {    
        if (!endpointConfigurationProvider) throw new Error(`Argument 'endpointConfigurationProvider' cannot be null.`);
        if (!transportImplementation) throw new Error(`Argument 'transportImplementation' cannot be null.`);
        if (!messageHandlerProvider) throw new Error(`Argument 'messageHandlerProvider' cannot be null.`);

        this._endpointConfigProvider = endpointConfigurationProvider;
        this._transportImplementation = transportImplementation;
        this._messageHandlerProvider = messageHandlerProvider;
    }

    startListening = () => {
        console.log('Start listening...');
        this._transportImplementation.startListening(this.handleMessage);
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

    send = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) => {
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

    private handleMessage = (msgType: interfaces.MessageType, msg: any) => {
        let handlers = this._messageHandlerProvider.getHandlersForMessageType(msgType);
        handlers.map(h => h.handle(msg));
    }

    private getMessageTypeAsString = (msgType: interfaces.MessageType) => {
        return typeof msgType === 'symbol' ? Symbol.keyFor(msgType) : msgType;
    }
}
