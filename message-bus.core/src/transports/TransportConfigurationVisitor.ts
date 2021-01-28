import * as interfaces from '../interfaces';
import { interfaces as inversifyInterfaces } from 'inversify';

export class TransportConfigurationVisitor implements interfaces.ITransportConfigurationVisitor {
    private callback: ((container: inversifyInterfaces.Container) => void) | undefined;

    configureTransport = (callback: (container: inversifyInterfaces.Container) => void) => {
        this.callback = callback;
    }

    configure = (container: inversifyInterfaces.Container) => {
        if (this.callback) this.callback(container);
    }
}