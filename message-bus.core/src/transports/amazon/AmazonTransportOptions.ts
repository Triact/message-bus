import { injectable } from "inversify";
import * as AWS from 'aws-sdk';

@injectable()
export class AmazonTransportOptions {
    awsConfig: AWS.Config = new AWS.Config();
    awsAccountId: string = '';
    useLambda: boolean = false;
}