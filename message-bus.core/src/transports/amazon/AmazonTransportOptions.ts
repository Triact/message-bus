import { injectable } from "inversify";

@injectable()
export class AmazonTransportOptions {
    awsConfig: AWS.Config;
    awsAccountId: string;
    useLambda: boolean = false;
}