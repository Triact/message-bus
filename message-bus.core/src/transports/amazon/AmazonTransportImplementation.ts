import * as AWS from 'aws-sdk';
import { inject, injectable } from 'inversify';
import * as interfaces from '../../interfaces';
import * as amazonInterfaces from './interfaces';
import AmazonConsumer from './AmazonConsumer';
import { AmazonTransport } from './AmazonTransport';
import { AmazonTransportOptions } from './AmazonTransportOptions';
import EndpointConfiguration, { IProvideEndpointConfiguration } from '../../configuration/EndpointConfiguration';

@injectable()
export class AmazonTransportImplementation implements interfaces.ITransportImplementation {
    
    private options: AmazonTransportOptions;
    private endpointConfig: IProvideEndpointConfiguration;
    private sns: AWS.SNS;
    private sqs: AWS.SQS;
    private consumer: AmazonConsumer;

    constructor(
        @inject(interfaces.TYPES.IProvideEnpointConfiguration) endpointConfig: IProvideEndpointConfiguration,
        @inject(amazonInterfaces.TYPES.AmazonTransportOptions) options: AmazonTransportOptions        
    ) {
        if (!endpointConfig) throw new Error(`Argument 'endpointConfig' cannot be null.`);
        if (!options) throw new Error(`Argument 'options' cannot be null.`);

        this.options = options;
        this.endpointConfig = endpointConfig;
        this.sns = new AWS.SNS(options.awsConfig);
        this.sqs = new AWS.SQS(options.awsConfig);
    }
    
    startListening = (messageReceivedCallback: (msgType: interfaces.MessageType, msg: any) => void) => {
        if (this.consumer) throw new Error('Already started');

        this.consumer = new AmazonConsumer({
            sqs: this.sqs,
            queueUrl: `https://sqs.${this.options.awsConfig.region}.amazonaws.com/${this.options.awsAccountId}/${this.endpointConfig.endpointName}`,
            messageHandler: messageReceivedCallback
        });
        this.consumer.start();
    }

    publish = <T>(msg: T, msgType: string, topic: string) => {
        this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: `arn:aws:sns:${this.options.awsConfig.region}:${this.options.awsAccountId}:${topic}`,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType },
                'MessageBus.TimeSent': { DataType: 'String', StringValue: new Date().toISOString()}
            }
        }, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
            if (error) console.error("Error publishing message.", error);
        });
    }

    send = <T>(msg: T, msgType: string, queue: string) => {
        let params = {
            DelaySeconds: 0,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType },
                'MessageBus.TimeSent': { DataType: 'String', StringValue: new Date().toISOString()}
            },
            MessageBody: JSON.stringify(msg),
            QueueUrl: `https://sqs.${this.options.awsConfig.region}.amazonaws.com/${this.options.awsAccountId}/${queue}`
        } as AWS.SQS.SendMessageRequest;
        this.sqs.sendMessage(params, (error, data) => {
            if (error) console.error('Error sending message.', error);
        });
    }
}