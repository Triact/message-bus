import "reflect-metadata";
import { injectable } from "inversify";
import { interfaces } from './interfaces';

@injectable()
export default class Bus implements interfaces.IBus {

    private transport: interfaces.ITransport;
    private routing: interfaces.IRouting;

    constructor(transport: interfaces.ITransport, routing: interfaces.IRouting) {
        this.transport = transport;
        this.routing = routing;
    }

    publish = <T>(ctor: new (...args: any[]) => T, populateMessage: (m:T) => void) => {
        const msg = new ctor();
        populateMessage(msg);

        const dest = this.routing.getDestination<T>(msg);

        this.transport.publish(msg, dest.msgType.toString(), dest.topic);
    }
}
