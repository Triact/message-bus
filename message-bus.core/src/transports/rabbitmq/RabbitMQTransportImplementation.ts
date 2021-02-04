import { connect, Connection } from 'amqplib';
import { inject, injectable } from 'inversify';
import { RabbitMQTransportOptions, TYPES } from '.';
import { IProvideEndpointConfiguration } from '../../configuration/EndpointConfiguration';
import * as interfaces from '../../interfaces';
import MessageContext from '../../MessageContext';

@injectable()
export class RabbitMQransportImplementation implements interfaces.ITransportImplementation {
    logger: interfaces.ILogger;
    options: RabbitMQTransportOptions;
    endpointConfig: IProvideEndpointConfiguration;

    socket: Promise<Connection>;


    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfig: IProvideEndpointConfiguration,
        @inject(TYPES.RabbitMQTransportOptions) options: RabbitMQTransportOptions,
        @inject(interfaces.TYPES.ILogger) logger: interfaces.ILogger
    ) {
        if (!endpointConfig) throw new Error(`Argument 'endpointConfig' cannot be null.`);
        if (!options) throw new Error(`Argument 'options' cannot be null.`);
        if (!logger) throw new Error(`Argument 'logger' cannot be null.`);

        this.options = options;
        this.endpointConfig = endpointConfig;
        this.logger = logger;

        this.socket = connect(this.options.url);
    }

    publish<T>(msg: T, msgType: string | undefined, topic: string): void {
        throw new Error('Method not implemented.');
    }

    send<T>(msg: T, msgType: string | undefined, queue: string): void {
        const q = this.endpointConfig.endpointName!;
        this.socket
            .then(conn => conn.createChannel())
            .then(channel => {
                channel.assertQueue(q).then(ok =>
                    channel.sendToQueue(q, Buffer.from(JSON.stringify(msg)), {
                        headers: {
                            'MessageBus.MessageType': { DataType: 'String', StringValue: msgType },
                        }
                    })
                );
            }).catch(console.warn);
    }

    startListening(
        messageHandler: (msgType: interfaces.MessageType, msg: any, context: interfaces.IMessageContext) => void,
        createMessageContextCallback: () => MessageContext): void {
        const q = this.endpointConfig.endpointName!;
        this.socket
            .then(conn => conn.createChannel())
            .then(
                channel => {
                    channel.assertQueue(q)
                        .then(ok => {
                            channel.consume(q, function (msg) {
                                if (msg !== null) {
                                    let msgTypeAttr = msg.properties.headers['MessageBus.MessageType'];
                                    if (!msgTypeAttr || !msgTypeAttr.StringValue) throw new Error('Message type unknown.');
                                    let msgType = Symbol.for(msgTypeAttr.StringValue);

                                    messageHandler(msgType, JSON.parse(msg.content.toString()), createMessageContextCallback());

                                    channel.ack(msg);
                                }
                            });
                        });
                }
            )
    }
}