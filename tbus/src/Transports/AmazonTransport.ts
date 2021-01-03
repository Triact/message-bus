import { interfaces } from "../interfaces";
import * as AWS from 'aws-sdk';


export class AmazonTransport implements interfaces.ITransport {
    
    private sns: AWS.SNS;

    constructor(awsConfig: AWS.Config) {
        console.log('AWS Transport', (awsConfig.credentials as any).profile);
        this.sns = new AWS.SNS(awsConfig);
    }

    publish = <T>(msg: T, msgType: string, topic: string) => {
        console.log(`AMAZON: publish '${msgType}' ${msg} to ${topic}`);
        console.log('AWS publish:', (AWS.config.credentials as any).profile);

        this.sns.publish({
            Message: JSON.stringify(msg),
            TopicArn: topic,
            MessageAttributes: {
                'Triact.MessageType': { DataType: 'String', StringValue: msgType}
            }
        }, (error: AWS.AWSError, data: AWS.SNS.PublishResponse) => {
            if (error) console.error("Error publishing message:", error);
        });
        
    };
}
