"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonTransport = void 0;
const AWS = require("aws-sdk");
class AmazonTransport {
    constructor(awsConfig) {
        this.publish = (msg, msgType, topic) => {
            this.sns.publish({
                Message: JSON.stringify(msg),
                TopicArn: topic,
                MessageAttributes: {
                    'MessageBus.MessageType': { DataType: 'String', StringValue: msgType }
                }
            }, (error, data) => {
                if (error)
                    console.error("Error publishing message:", error);
            });
        };
        this.sns = new AWS.SNS(awsConfig);
    }
}
exports.AmazonTransport = AmazonTransport;
//# sourceMappingURL=AmazonTransport.js.map