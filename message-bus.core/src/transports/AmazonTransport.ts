import * as AWS from 'aws-sdk';
import { SQS } from 'aws-sdk';
import * as interfaces from "../interfaces";

interface AmazonTransportOptions {
    awsConfig: AWS.Config;
    useLambda: boolean | undefined;
}

export class AmazonTransport implements interfaces.ITransport {

    private sns: AWS.SNS;
    private sqs: AWS.SQS;
    private consumers: any[] = [];

    constructor(options: AmazonTransportOptions) {
        if (!options) throw Error(`Argument 'options' cannot be null.`);
        if (!options.awsConfig) throw new Error(`Argument 'options.awsConfig' cannot be null.`);

        this.sns = new AWS.SNS(options.awsConfig);
        this.sqs = new AWS.SQS(options.awsConfig);
    }

    createConsumers(routesProvides: interfaces.IProvideRoutes, handlerProvider: interfaces.IProvideMessageHandler): void {
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

interface AmazonConsumerOptions<T> {
    sqs: SQS;
    queueUrl: string;
    handlers: interfaces.IHandleMessages<T>[]
}

class AmazonConsumer<T> {
    //private options: AmazonConsumerOptions<T>;
    options: AmazonConsumerOptions<T>;

    constructor(options: AmazonConsumerOptions<T>) {
        this.options = options;
    }

    public start = async () => {
        //console.log("### starting consumer", this.options)
        this.poll();
    }

    private poll = (): void => {
        try {
            this.options.sqs
                .receiveMessage({ QueueUrl: this.options.queueUrl })
                .promise()
                .then(this.handleResponse);

            setTimeout(this.poll, 1000);
        } catch (err) {
            console.error('pollerr', err);
        } finally {
            //setTimeout(this.poll, 1000);
        }
    }

    private handleResponse = async (response: SQS.ReceiveMessageResult): Promise<void> => {
        if (response) {
            if (response.Messages && response.Messages.length > 0) {
                await Promise.all(response.Messages.map(this.processMessage));
            } else {
                // empty
            }
        }
    }

    private processMessage = async (message: SQS.Message): Promise<void> => {
        try {

            console.log(this.options.handlers[0].handle, message);
            await this.options.handlers[0].handle(JSON.parse(message.Body!) as T);
            await this.deleteMessage(message);
        }
        catch (err) {
            console.error('processMessage', err);
        }
    }

    private async deleteMessage(message: SQS.Message): Promise<void> {

        const deleteParams = {
            QueueUrl: this.options.queueUrl,
            ReceiptHandle: message.ReceiptHandle!
        };

        try {
            await this.options.sqs
                .deleteMessage(deleteParams)
                .promise();
        } catch (err) {
            console.error('deleteMessage', err);
        }
    }

}
