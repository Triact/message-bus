import * as AWS from 'aws-sdk';
import { SQS } from 'aws-sdk';
import { inject } from 'inversify';
import { IProvideEndpointConfiguration } from '../../configuration/EndpointConfiguration';
import * as interfaces from "../../interfaces";
import { interfaces as inversifyInterfaces } from 'inversify';
import * as amazonInterfaces from './interfaces';
import AmazonConsumer from './AmazonConsumer';
import { AmazonTransportImplementation } from './AmazonTransportImplementation';
import { AmazonTransportOptions } from './AmazonTransportOptions';

export class AmazonTransport implements interfaces.ITransport {

    private readonly _options: AmazonTransportOptions = new AmazonTransportOptions();
    
    constructor(visitor: interfaces.ITransportConfigurationVisitor) {

        visitor.configureTransport((container: inversifyInterfaces.Container) => {
            container.bind(amazonInterfaces.TYPES.AmazonTransportOptions).toConstantValue(this._options);
            container.bind(interfaces.TYPES.ITransportImplementation).to(AmazonTransportImplementation).inSingletonScope();
        });
    }

    awsConfig = (awsConfig: AWS.Config, awsAccountId: string) :  AmazonTransport => {
        if (!awsConfig) throw new Error(`Argument 'awsConfig' cannot be null.`);
        if (!awsAccountId) throw new Error(`Argument 'awsAccountId' cannot be null.`);

        this._options.awsConfig = awsConfig;
        this._options.awsAccountId = awsAccountId;
        return this;
    }

    // useLambda = () : AmazonTransport => {
    //     this._options.useLambda = true;
    //     return this;
    // }
}
