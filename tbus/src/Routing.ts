import { interfaces } from './interfaces';

export class Routing implements interfaces.IRouting {
    routes: any = {};

    // routeToTopic<T>(messageType: interfaces.MessageType, topic: string): void {
    //     this.routes[messageType] = topic;
    // }

    routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void {
        const msg = new ctor();
        const msgType = Reflect.getMetadata('MessageType', msg);
        console.log(`MessageType: ${msgType.toString()}`);
        this.routes[msgType] = topic;
    }
    
    getDestination<T>(msg: T): { msgType: string, topic: string } {
        const msgType = Reflect.getMetadata('MessageType', msg);
        if (!(msgType in this.routes)) throw Error(`Unknown messageType:${msgType.toString()}.`);
        return {
            msgType: msgType,
            topic: this.routes[msgType]
        };
    }
}