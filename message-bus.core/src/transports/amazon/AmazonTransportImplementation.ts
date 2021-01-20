import * as AWS from 'aws-sdk';
import { inject, injectable } from 'inversify';
import * as interfaces from '../../interfaces';
import * as amazonInterfaces from './interfaces';
import AmazonConsumer from './AmazonConsumer';
import { AmazonTransport } from './AmazonTransport';
import { AmazonTransportOptions } from './AmazonTransportOptions';

@injectable()
export class AmazonTransportImplementation implements interfaces.ITransportImplementation {
    
    private sns: AWS.SNS;
    private sqs: AWS.SQS;
    private consumers: any[] = [];

    constructor(
        @inject(amazonInterfaces.TYPES.AmazonTransportOptions) options: AmazonTransportOptions
    ) {
        this.sns = new AWS.SNS(options.awsConfig);
        this.sqs = new AWS.SQS(options.awsConfig);
    }
    
    createConsumers(routesProvides: interfaces.IProvideRoutes, handlerProvider: interfaces.IProvideMessageHandlers): void {
        var routes = routesProvides.getRoutes()

        console.log("### creating consumers")
        routes.forEach((r) => {
            console.log(r);

            let consumer = new AmazonConsumer({
                sqs: this.sqs,
                queueUrl: r.topic,
                handlers: handlerProvider.getHandlersForMessageType(r.msgCtor, r.msgType)
            });

            console.log('### HANDLER', consumer.options.handlers)
            consumer.options.handlers[0].handle({});

            consumer.start();

            this.consumers.push(consumer);
        });
    }

    publish = <T>(msg: T, msgType: string, topic: string) => {
        this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: topic,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType }
            }
        }, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
            if (error) console.error("Error publishing message.", error);
        });
    }

    send = <T>(msg: T, msgType: string, queue: string) => {
        let params = {
            DelaySeconds: 0,
            MessageAttributes: {
                "MessageBus.MessageType": {
                    DataType: "String",
                    StringValue: msgType
                }
            },
            MessageBody: JSON.stringify(msg),
            QueueUrl: queue
        } as AWS.SQS.SendMessageRequest;
        this.sqs.sendMessage(params, (error, data) => {
            if (error) console.error('Error sending message.', error);
        });
    }
}