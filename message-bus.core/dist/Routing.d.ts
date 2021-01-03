import { interfaces } from './interfaces';
export declare class Routing implements interfaces.IRouting {
    routes: any;
    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
    getDestination<T>(msg: T): {
        msgType: string;
        topic: string;
    };
}
