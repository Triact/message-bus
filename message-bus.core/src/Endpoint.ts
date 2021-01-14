import { Container } from 'inversify';
import Bus from './Bus';
import EndpointConfiguration, { IProvideEndpointConfiguration } from './configuration/EndpointConfiguration'
import HandlingConfiguration from './configuration/HandlingConfiguration';
import RoutingConfiguration from './configuration/RoutingConfiguration';
import * as interfaces from './interfaces';

interface StartOptions {
    sendOnly?: boolean;
}

export default class Endpoint {

    private config = new EndpointConfiguration();

    constructor(name: string) {
        this.config.endpointName = name;
        this.config.container = new Container();
    }

    useExistingContainer = (container: Container) => {
        if (!container) throw new Error(`Argument 'container' cannot be null.`);
        this.config.container = Container.merge(this.config.container, container);
    }

    useTransport = <T extends interfaces.ITransport>(ctor: new (...args: any[])=> T, callback: (transport: T) => void) => {
        if (!ctor) throw new Error(`Argument 'ctor' cannot be null.`);

        let transport = new ctor();
        callback(transport);
        transport.configure(this.config.container);
    }

    routes = (callback: (routing: RoutingConfiguration) => void) => {
        if (!callback) throw Error(`Argument 'callback' cannot be null.`);
        callback(this.config.routing);
    }

    start = (options: StartOptions = {}): interfaces.IBus => {
        console.log("Starting endpoint...")
        this.config.container.bind<IProvideEndpointConfiguration>(interfaces.TYPES.IProvideEnpointConfiguration).toConstantValue(this.config);
        this.config.container.bind<Bus>(interfaces.TYPES.Bus).to(Bus).inSingletonScope();

        var bus = this.config.container.get<Bus>(interfaces.TYPES.Bus);

        //var bus = new Bus(this.config.transport, this.config.routing, this.config.handling);

        if (options.sendOnly && this.config.handling.areRegistered()) 
            throw new Error('Registering handlers is not supported when running in SendOnly mode.');

        if (!options.sendOnly) {
            bus.startListening();
        }

        console.log('Endpoint stated.');
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
