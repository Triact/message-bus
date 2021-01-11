import * as interfaces from "../interfaces";
import * as AWS from 'aws-sdk';

export class AmazonTransport implements interfaces.ITransport {
    
    private sns: AWS.SNS;
    private sqs: AWS.SQS;

    constructor(awsConfig: AWS.Config) {
        this.sns = new AWS.SNS(awsConfig);
        this.sqs = new AWS.SQS(awsConfig);
    }

    publish = <T>(msg: T, msgType: string, topic: string) => {
        this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: topic,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType}
            }
        }, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
            if (error) console.error("Error publishing message.", error);
        });
    }

    send = <T>(msg: T, msgType: string, queue: string) => {
        let params = {
            DelaySeconds: 0,
            MessageAttributes: {
                "MessageBus.MessageType" : {
                    DataType:"String",
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

interface AmazonConsumerOptions {
    sqs: SQS;
    queueUrl: string;
    handleMessage: (message: SQS.Message) => Promise<void>
}

class AmazonConsumer {
    private options: AmazonConsumerOptions;

    constructor(options: AmazonConsumerOptions) {
        this.options = options;
    }

    public start = (): void => {
        this.poll();
    }

    private poll = (): void => {
        try {
            this.options.sqs
                .receiveMessage({ QueueUrl: this.options.queueUrl })
                .promise()
                .then(this.handleResponse);
        } catch (err) {
            console.error(err);
        } finally {
            setTimeout(this.poll, 10);
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
            await this.options.handleMessage(message);
            await this.deleteMessage(message);
        }
        catch {

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
            //throw toSQSError(err, `SQS delete message failed: ${err.message}`);
        }
    }

}
