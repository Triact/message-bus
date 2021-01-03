import { Routing } from './Routing';
import { interfaces } from './interfaces';
export default class Endpoint {
    private routing;
    private transport;
    constructor();
    useTransport: <T extends interfaces.ITransport>(transport: T) => void;
    routes: (callback: (routing: Routing) => void) => void;
    sendOnly: () => interfaces.IBus;
}
