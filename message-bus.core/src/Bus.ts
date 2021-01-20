import { inject, injectable } from "inversify";
import { IProvideEndpointConfiguration } from "./configuration/EndpointConfiguration";
import { MessageHelper } from "./helpers/MessageHelper";
import * as interfaces from './interfaces';

@injectable()
export default class Bus implements interfaces.IBus {

    private _endpointConfigProvider: IProvideEndpointConfiguration;
    private _transportImplementation: interfaces.ITransportImplementation;

    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfigurationProvider: IProvideEndpointConfiguration,
        @inject(interfaces.TYPES.ITransportImplementation) transportImplementation: interfaces.ITransportImplementation
    ) {    
        if (!endpointConfigurationProvider) throw new Error(`Argument 'endpointConfigurationProvider' cannot be null.`);
        if (!transportImplementation) throw new Error(`Argument 'transportImplementation' cannot be null.`);

        this._endpointConfigProvider = endpointConfigurationProvider;
        this._transportImplementation = transportImplementation;
    }

    startListening = () => {
        this._transportImplementation.createConsumers(this._endpointConfigProvider.routing, this._endpointConfigProvider.handling);
    }

    publish = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.EVENT)) 
            throw new Error(`Only events can be published.`);

        populateMessageCallback(msg);

        const dest = this._endpointConfigProvider.routing.getDestination<T>(msg);

        this._transportImplementation.publish(msg, dest.msgType.toString(), dest.topic);
    }

    send = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.COMMAND))
            throw new Error(`Only command can be send.`)

        populateMessageCallback(msg);

        const dest = this._endpointConfigProvider.routing.getDestination<T>(msg);

        this._transportImplementation.send(msg, dest.msgType.toString(), dest.topic);
    }
}
