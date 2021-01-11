import * as interfaces from '../interfaces';

export default class RoutingConfiguration implements interfaces.IRoutingConfiguration, interfaces.IProvideRoutes {

    private routes: any = {};

    routeToTopic = <T>(msgCtor: new (...args: any[]) => T, topic: string) => {
        if (!msgCtor) throw new Error(`Argumen 'msgCtor' cannot be null.`);
        if (!topic) throw new Error(`Argument 'topic' cannot be null.`);

        const msg = new msgCtor();
        const msgType = Reflect.getMetadata('MessageType', msg);

        if (!msgType) throw new Error(`Unable to resolve message type of message:${msgCtor.name}. Use one of the message decorators to set the message type fof the message.`);

        const msgPurpose = Reflect.getMetadata('MessagePurpose', msg);
        if (msgPurpose !== interfaces.MessagePurposes.EVENT) throw new Error(`Unable to route ${msgPurpose} to topics. Only events can be routed to topics.`);

        this.routes[msgType] = topic;
    }

    getRoutes(): interfaces.RouteDefinition[] {
        return Object.getOwnPropertyNames(this.routes).map(o => {
            return { msg: o, topic: this.routes[o] }
        });
    }

    routeToEndpoint = <T>(msgCtor: new (...args: any[]) => T, queue: string) => {
        if (!msgCtor) throw new Error(`Argumen 'msgCtor' cannot be null.`);
        if (!queue) throw new Error(`Argument 'queue' cannot be null.`);

        const msg = new msgCtor();
        const msgType = Reflect.getMetadata('MessageType', msg);

        if (!msgType) throw new Error(`Unable to resolve message type of message:${msgCtor.name}. Use one of the message decorators to set the message type fof the message.`);

        const msgPurpose = Reflect.getMetadata('MessagePurpose', msg);
        if (msgPurpose !== interfaces.MessagePurposes.COMMAND) throw new Error(`Unable to route ${msgPurpose} to topics. Only commands can be routed to queues.`);

        this.routes[msgType] = queue;
    }

    getDestination = <T>(msg: T): { msgType: string, topic: string } => {
        const msgType = Reflect.getMetadata('MessageType', msg);
        if (!(msgType in this.routes)) throw Error(`Route for message:${msgType.toString()} not found.`);
        return {
            msgType: msgType,
            topic: this.routes[msgType]
        };
    }
}