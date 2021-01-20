import { injectable } from "inversify";

@injectable()
export class AmazonTransportOptions {
    awsConfig: AWS.Config;
    useLambda: boolean = false;
}