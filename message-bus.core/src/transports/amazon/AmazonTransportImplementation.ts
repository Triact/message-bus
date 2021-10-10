import * as AWS from 'aws-sdk';
import { inject, injectable } from 'inversify';
import * as interfaces from '../../interfaces';
import * as amazonInterfaces from './interfaces';
import AmazonConsumer from './AmazonConsumer';
import { AmazonTransport } from './AmazonTransport';
import { AmazonTransportOptions } from './AmazonTransportOptions';
import EndpointConfiguration, { IProvideEndpointConfiguration } from '../../configuration/EndpointConfiguration';
import MessageContext from '../../MessageContext';

@injectable()
export class AmazonTransportImplementation implements interfaces.ITransportImplementation {
    
    private options: AmazonTransportOptions;
    private endpointConfig: IProvideEndpointConfiguration;
    private sns: AWS.SNS;
    private sqs: AWS.SQS;
    private consumer: AmazonConsumer | undefined;
    private logger: interfaces.ILogger;

    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfig: IProvideEndpointConfiguration,
        @inject(amazonInterfaces.TYPES.AmazonTransportOptions) options: AmazonTransportOptions,
        @inject(interfaces.TYPES.ILogger) logger: interfaces.ILogger        
    ) {
        if (!endpointConfig) throw new Error(`Argument 'endpointConfig' cannot be null.`);
        if (!options) throw new Error(`Argument 'options' cannot be null.`);
        if (!logger) throw new Error(`Argument 'logger' cannot be null.`);

        this.options = options;
        this.endpointConfig = endpointConfig;
        this.sns = new AWS.SNS(options.awsConfig);
        this.sqs = new AWS.SQS(options.awsConfig);
        this.logger = logger;
    }
    
    startListening = (
        messageReceivedCallback: (msgType: interfaces.MessageType, msg: any, context: interfaces.IMessageContext) => Promise<void>,
        createMessageContextCallbak: () => MessageContext
    ) => {
        if (this.consumer) throw new Error('Already started');

        this.consumer = new AmazonConsumer({
            sqs: this.sqs,
            queueUrl: `https://sqs.${this.options.awsConfig.region}.amazonaws.com/${this.options.awsAccountId}/${this.endpointConfig.endpointName}`,
            messageHandler: messageReceivedCallback,
            createMessageContextCallback: createMessageContextCallbak,
            logger: this.logger
        });
        this.consumer.start();
    }

    publish = async <T>(msg: T, msgType: string, topic: string) : Promise<void>=> {
        await this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: `arn:aws:sns:${this.options.awsConfig.region}:${this.options.awsAccountId}:${topic}`,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType },
                'MessageBus.TimeSent': { DataType: 'String', StringValue: new Date().toISOString()}
            }
        }).promise();
    }

    send = async <T>(msg: T, msgType: string, queue: string) : Promise<void> => {
        const params = {
            DelaySeconds: 0,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType },
                'MessageBus.TimeSent': { DataType: 'String', StringValue: new Date().toISOString()}
            },
            MessageBody: JSON.stringify(msg),
            QueueUrl: `https://sqs.${this.options.awsConfig.region}.amazonaws.com/${this.options.awsAccountId}/${queue}`
        } as AWS.SQS.SendMessageRequest;
        await this.sqs.sendMessage(params).promise();
    }
}