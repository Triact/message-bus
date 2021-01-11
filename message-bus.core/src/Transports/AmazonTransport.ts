import { AWSError, SNS, SQS } from 'aws-sdk';
import { interfaces } from "../interfaces";

export class AmazonTransport implements interfaces.ITransport {

    private sns: SNS;
    private consumers: AmazonConsumer[] = [];

    constructor(awsConfig: AWS.Config) {
        this.sns = new SNS(awsConfig);
    }

    createConsumers = () => {

    }

    publish = <T>(msg: T, msgType: string, topic: string) => {
        this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: topic,
            MessageAttributes: {
                'MessageBus.MessageType': { DataType: 'String', StringValue: msgType }
            }
        }, (error: AWSError, data: SNS.PublishResponse) => {
            if (error) console.error("Error publishing message:", error);
        });
    };
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
