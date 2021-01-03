import { interfaces } from "../interfaces";
import * as AWS from 'aws-sdk';
export declare class AmazonTransport implements interfaces.ITransport {
    private sns;
    constructor(awsConfig: AWS.Config);
    publish: <T>(msg: T, msgType: string, topic: string) => void;
}
