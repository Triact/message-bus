import { SQS } from 'aws-sdk';
import * as interfaces from "../../interfaces";

interface AmazonConsumerOptions<T> {
    sqs: SQS;
    queueUrl: string;
    handlers: interfaces.IHandleMessages<T>[]
}

export default class AmazonConsumer<T> {
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