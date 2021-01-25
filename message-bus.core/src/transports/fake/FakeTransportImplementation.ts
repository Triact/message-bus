import { inject, injectable } from "inversify";
import { IMessageContext, ITransportImplementation, MessageType } from "../../interfaces";
import MessageContext from "../../MessageContext";
import * as interfaces from '../../interfaces';

@injectable()
export default class FakeTransportImplementation implements ITransportImplementation {

    private logger: interfaces.ILogger;

    constructor(
        @inject(interfaces.TYPES.ILogger) logger: interfaces.ILogger
    ) {
        this.logger = logger;
    }

    publish<T>(msg: T, msgType: string | undefined, topic: string): void {
        this.logger.info(`FakeTransport: publishing message:${msgType} to topic:${topic}`, msg);
    }

    send<T>(msg: T, msgType: string | undefined, queue: string): void {
        this.logger.info(`FakeTransport: sending message:${msgType} to queue:${queue}`, msg);
    }

    startListening(messageHandler: (msgType: MessageType, msg: any, context: IMessageContext) => void, createMessageContextCallback: () => MessageContext): void {
        this.logger.info(`FakeTransport: Listening for messsages not supported.`);
    }
}