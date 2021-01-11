import Bus  from './Bus';
import RoutingConfiguration from './Configuration/RoutingConfiguration';
import HandlingConfiguration from './Configuration/HandlingConfiguration';
import * as interfaces from './interfaces';
import * as AWS from 'aws-sdk';
import Bus from './Bus';
import { GetImplementations, interfaces } from './interfaces';
import { Routing } from './Routing';

interface StartOptions {
    sendOnly?: boolean;
}

export default class Endpoint {

    private routing = new RoutingConfiguration();    
    private handling = new HandlingConfiguration();
    private transport: interfaces.ITransport;    

    constructor() {
        //console.log('###', (AWS.config.credentials as any).profile);
    }

    useTransport = <T extends interfaces.ITransport>(transport: T) => {
        if (!transport) throw new Error(`Argument 'transport' cannot be null.`);
        this.transport = transport;
    }

    routes = (callback: (routing: RoutingConfiguration) => void) => {
        if (!callback) throw Error(`Argument 'callback' cannot be null.`);
        callback(this.routing);
    }

    start = (options: StartOptions = {}): interfaces.IBus => {
        var bus = new Bus(this.transport, this.routing);

        console.log('### implementations: ', GetImplementations());

        if (!options.sendOnly) {
            bus.listen();
        }

        return bus;
    }

    handlers = (callback: (handling: interfaces.IHandlingConfiguration) => void) => {
        if (!callback) throw new Error(`Argument 'callback' cannot be null.`);
        callback(this.handling);
    }

    sendOnly = () : interfaces.IBus => {
        if (this.handling.areRegistered()) throw new Error('Registering handlers is not supported when running in SendOnly mode.');
        return new Bus(this.transport, this.routing);
    }
}
