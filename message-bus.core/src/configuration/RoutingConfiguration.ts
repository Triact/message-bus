import * as interfaces from '../interfaces';

export default class RoutingConfiguration implements interfaces.IRoutingConfiguration {

    private routes: any = {};

    getDestination = <T>(msg: T): { msgType: interfaces.MessageType, topic: string } => {
        const msgType = Reflect.getMetadata('MessageType', msg);
        if (!(msgType in this.routes)) throw Error(`Route for message:${msgType.toString()} not found.`);
        return {
            msgType: msgType,
            topic: this.routes[msgType].topic
        };
    }

    getRoutes(): interfaces.RouteDefinition<interfaces.IMessage>[] {
        return Object.getOwnPropertySymbols(this.routes).map(o => {
            return { msgType: o, topic: this.routes[o].topic, msgCtor: this.routes[o].msgCtor }
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

        this.routes[msgType] = { topic: queue, msgCtor: msgCtor };
    }

    routeToTopic = <T>(msgCtor: new (...args: any[]) => T, topic: string) => {
        if (!msgCtor) throw new Error(`Argumen 'msgCtor' cannot be null.`);
        if (!topic) throw new Error(`Argument 'topic' cannot be null.`);

        const msg = new msgCtor();
        const msgType = Reflect.getMetadata('MessageType', msg);

        if (!msgType) throw new Error(`Unable to resolve message type of message:${msgCtor.name}. Use one of the message decorators to set the message type fof the message.`);

        const msgPurpose = Reflect.getMetadata('MessagePurpose', msg);
        if (msgPurpose !== interfaces.MessagePurposes.EVENT) throw new Error(`Unable to route ${msgPurpose} to topics. Only events can be routed to topics.`);

        this.routes[msgType] = { topic: topic, msgCtor: msgCtor };
    }
}