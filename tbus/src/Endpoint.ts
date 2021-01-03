import Bus  from './Bus';
import { Routing } from './Routing';
import { interfaces } from './interfaces';
import * as AWS from 'aws-sdk';

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

    sendOnly = () : interfaces.IBus => {
        return new Bus(this.transport, this.routing);
    }
}
