import "reflect-metadata";
import { injectable } from "inversify";
import * as interfaces from './interfaces';
import { MessageHelper } from "./Helpers/MessageHelper";

@injectable()
export default class Bus implements interfaces.IBus {

    private transport: interfaces.ITransport;
    private routing: interfaces.IRouting;

    constructor(transport: interfaces.ITransport, routing: interfaces.IRouting) {
        if (!transport) throw new Error(`Argumet 'transport' cannot be null`);
        if (!routing) throw new Error(`Argument 'routing' cannot be null.`);

        this.transport = transport;
        this.routing = routing;
    }

    publish = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m:T) => void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.EVENT)) 
            throw new Error(`Only events can be published.`);

        populateMessageCallback(msg);

        const dest = this.routing.getDestination<T>(msg);

        this.transport.publish(msg, dest.msgType.toString(), dest.topic);
    }

    send = <T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void) => {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);
        
        const msg = new msgCtor();
        if (!MessageHelper.isOfPurpose<T>(msg, interfaces.MessagePurposes.COMMAND))
            throw new Error(`Only command can be send.`)

        populateMessageCallback(msg);

        const dest = this.routing.getDestination<T>(msg);

        this.transport.send(msg, dest.msgType.toString(), dest.topic);
    }
}
