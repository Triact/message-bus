import Bus  from './Bus';
import { Routing } from './Routing';
import * as interfaces from './interfaces';
import * as AWS from 'aws-sdk';

export default class Endpoint {

    private routing = new Routing();    
    private transport: interfaces.ITransport;

    constructor() {
        //console.log('###', (AWS.config.credentials as any).profile);
    }

    useTransport = <T extends interfaces.ITransport>(transport: T) => {
        if (!transport) throw new Error(`Argument 'transport' cannot be null.`);
        this.transport = transport;
    }

    routes = (callback: (routing: Routing) => void) => {
        if (!callback) throw Error(`Argument 'callback' cannot be null.`);
        callback(this.routing);
    } 

    sendOnly = () : interfaces.IBus => {
        return new Bus(this.transport, this.routing);
    }
}