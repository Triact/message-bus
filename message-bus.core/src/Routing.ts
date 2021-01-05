import { interfaces } from './interfaces';

export class Routing implements interfaces.IRouting {
    routes: any = {};

    // routeToTopic<T>(messageType: interfaces.MessageType, topic: string): void {
    //     this.routes[messageType] = topic;
    // }

    routeToTopic<T>(msgCtor: new (...args: any[]) => T, topic: string): void {
        if (!msgCtor) throw new Error(`Argumen 'msgCtor' cannot be null.`);
        if (!topic) throw new Error(`Argument 'topic' cannot be null.`);

        const msg = new msgCtor();
        const msgType = Reflect.getMetadata('MessageType', msg);

        if (!msgType) throw new Error(`Unable to resolve message type of message:${msgCtor.name}. Use one of the message decorators to set the message type fof the message.`);

        //console.log(`MessageType: ${msgType.toString()}`);
        this.routes[msgType] = topic;
    }
    
    getDestination<T>(msg: T): { msgType: string, topic: string } {
        const msgType = Reflect.getMetadata('MessageType', msg);
        if (!(msgType in this.routes)) throw Error(`Route for message:${msgType.toString()} not found.`);
        return {
            msgType: msgType,
            topic: this.routes[msgType]
        };
    }
}