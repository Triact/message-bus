import Bus from './Bus';
import HandlingConfiguration from './Configuration/HandlingConfiguration';
import RoutingConfiguration from './Configuration/RoutingConfiguration';
import * as interfaces from './interfaces';

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
        console.log("### Starting endpoint")
        var bus = new Bus(this.transport, this.routing, this.handling);

        if (options.sendOnly && this.handling.areRegistered()) 
            throw new Error('Registering handlers is not supported when running in SendOnly mode.');

        if (!options.sendOnly) {
            bus.startListening();
        }

        return bus;
    }

    handlers = (callback: (handling: interfaces.IHandlingConfiguration) => void) => {
        if (!callback) throw new Error(`Argument 'callback' cannot be null.`);
        callback(this.handling);
    }

    sendOnly = (): interfaces.IBus => {
        return this.start({sendOnly: true});
    }
}
