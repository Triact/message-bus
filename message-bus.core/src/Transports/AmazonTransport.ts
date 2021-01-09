import { interfaces } from "../interfaces";
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
