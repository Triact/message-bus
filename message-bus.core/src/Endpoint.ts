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
    private handlersCallback: (handling: interfaces.IHandlingConfiguration) => void;
    private customizeCallback: (container: inversifyInterfaces.Container) => void;

    constructor(name: string) {
        this.config.endpointName = name;
    }

    useExistingContainer = (container: inversifyInterfaces.Container) => {
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

    customize = (callback: (container: inversifyInterfaces.Container) => void) => {
        this.customizeCallback = callback;
    }

    handlers = (callback: (handling: interfaces.IHandlingConfiguration) => void) => {
        if (!callback) throw new Error(`Argument 'callback' cannot be null.`);
        this.handlersCallback = callback;
    }

    start = (options: StartOptions = {}): interfaces.IBus => {
        console.log("Starting endpoint...")
        if (!this.container) this.container = new Container();

        this.container.bind<IProvideEndpointConfiguration>(interfaces.TYPES.IProvideEnpointConfiguration).toConstantValue(this.config);
        this.container.bind<Bus>(interfaces.TYPES.Bus).to(Bus).inSingletonScope();
        
        this.transport.configure(this.container);
        
        let handling = new HandlingConfiguration(this.container);
        this.container.bind(interfaces.TYPES.IProvideMessageHandlers).toConstantValue(handling);

        if (!options.sendOnly) {
            // register messges handlers.
            if (this.handlersCallback) {                
                this.handlersCallback(handling);
            }
        }

        // customization
        if (this.customizeCallback) this.customizeCallback(this.container);

        var bus = this.container.get<Bus>(interfaces.TYPES.Bus);

        //if (options.sendOnly && this.config.handling.areRegistered()) 
        //    throw new Error('Registering handlers is not supported when running in SendOnly mode.');

        // start listening when not send only.
        if (!options.sendOnly) {
            bus.startListening();
        }

        console.log('Endpoint started.');
        return bus;
    }   

    sendOnly = (): interfaces.IBus => {
        return this.start({sendOnly: true});
    }
}
