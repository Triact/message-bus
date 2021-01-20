import { interfaces as inversifyInterfaces, Container } from 'inversify';
import Bus from './Bus';
import EndpointConfiguration, { IProvideEndpointConfiguration } from './configuration/EndpointConfiguration'
import HandlingConfiguration from './configuration/HandlingConfiguration';
import RoutingConfiguration from './configuration/RoutingConfiguration';
import * as interfaces from './interfaces';

interface StartOptions {
    sendOnly?: boolean;
}

export default class Endpoint {

    private container: inversifyInterfaces.Container;
    private config = new EndpointConfiguration();
    private transport: interfaces.ITransport;

    constructor(name: string) {
        this.config.endpointName = name;
    }

    useExistingContainer = (container: Container) => {
        if (!container) throw new Error(`Argument 'container' cannot be null.`);
        this.container = container;
    }

    useTransport = <T extends interfaces.ITransport>(ctor: new (...args: any[])=> T, callback: (transport: T) => void) => {
        if (!ctor) throw new Error(`Argument 'ctor' cannot be null.`);

        let transport = new ctor();
        callback(transport);
        this.transport = transport;        
    }

    routes = (callback: (routing: RoutingConfiguration) => void) => {
        if (!callback) throw Error(`Argument 'callback' cannot be null.`);
        callback(this.config.routing);
    }

    start = (options: StartOptions = {}): interfaces.IBus => {
        console.log("Starting endpoint...")
        if (!this.container) this.container = new Container();

        this.container.bind<IProvideEndpointConfiguration>(interfaces.TYPES.IProvideEnpointConfiguration).toConstantValue(this.config);
        this.container.bind<Bus>(interfaces.TYPES.Bus).to(Bus).inSingletonScope();
        
        this.transport.configure(this.container);

        var bus = this.container.get<Bus>(interfaces.TYPES.Bus);

        //var bus = new Bus(this.config.transport, this.config.routing, this.config.handling);

        if (options.sendOnly && this.config.handling.areRegistered()) 
            throw new Error('Registering handlers is not supported when running in SendOnly mode.');

        if (!options.sendOnly) {
            bus.startListening();
        }

        console.log('Endpoint started.');
        return bus;
    }

    handlers = (callback: (handling: interfaces.IHandlingConfiguration) => void) => {
        if (!callback) throw new Error(`Argument 'callback' cannot be null.`);
        callback(this.config.handling);
    }

    sendOnly = (): interfaces.IBus => {
        return this.start({sendOnly: true});
    }
}
