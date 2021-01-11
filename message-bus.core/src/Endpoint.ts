import * as AWS from 'aws-sdk';
import Bus from './Bus';
import { GetImplementations, interfaces } from './interfaces';
import { Routing } from './Routing';

interface StartOptions {
    sendOnly?: boolean;
}

export default class Endpoint {

    private routing = new Routing();
    private transport: interfaces.ITransport;

    constructor() {
        console.log('###', (AWS.config.credentials as any).profile);
    }

    useTransport = <T extends interfaces.ITransport>(transport: T) => {
        this.transport = transport;
    }

    routes = (callback: (routing: Routing) => void) => {
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
}
