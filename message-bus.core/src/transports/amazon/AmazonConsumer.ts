import { SQS } from 'aws-sdk';
import * as interfaces from "../../interfaces";
import MessageContext from '../../MessageContext';

interface AmazonConsumerOptions {
    sqs: SQS;
    queueUrl: string;
    messageHandler: (msgType: interfaces.MessageType, msg: any, context: interfaces.IMessageContext) => void,
    createMessageContextCallback: () => MessageContext
}

export default class AmazonConsumer {
    //private options: AmazonConsumerOptions<T>;
    options: AmazonConsumerOptions;

    constructor(options: AmazonConsumerOptions) {
        this.options = options;
    }

    public start = async () => {
        //console.log("### starting consumer", this.options)
        this.poll();
    }

    private poll = (): void => {
        try {
            this.options.sqs
                .receiveMessage({ 
                    QueueUrl: this.options.queueUrl,
                    //VisibilityTimeout: 20,
                    //WaitTimeSeconds: 10,
                    MessageAttributeNames: [
                        'All'
                    ]
                })
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
            let msgTypeAttr = message.MessageAttributes!['MessageBus.MessageType'];
            if (!msgTypeAttr || !msgTypeAttr.StringValue) throw new Error('Message type unknown.');
            let msgType = Symbol.for(msgTypeAttr.StringValue);
            let context = this.options.createMessageContextCallback();
            
            for (let key in message.MessageAttributes) {
                let value = message.MessageAttributes[key];
                if (value.StringValue)
                    context.addHeader(key, value.StringValue);
            }            

            await this.options.messageHandler(msgType, JSON.parse(message.Body!), context);
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