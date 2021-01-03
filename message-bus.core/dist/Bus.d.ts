import "reflect-metadata";
import { interfaces } from './interfaces';
export default class Bus implements interfaces.IBus {
    private transport;
    private routing;
    constructor(transport: interfaces.ITransport, routing: interfaces.IRouting);
    publish: <T>(ctor: new (...args: any[]) => T, populateMessage: (m: T) => void) => void;
}
