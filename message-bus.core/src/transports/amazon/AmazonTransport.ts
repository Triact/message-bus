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
import { AmazonInstaller } from './AmazonInstaller';

export class AmazonTransport implements interfaces.ITransport {

    private readonly options: AmazonTransportOptions = new AmazonTransportOptions();
    
    constructor(visitor: interfaces.ITransportConfigurationVisitor) {

        visitor.configureTransport((container: inversifyInterfaces.Container) => {
            container.bind(amazonInterfaces.TYPES.AmazonTransportOptions).toConstantValue(this.options);
            container.bind(interfaces.TYPES.ITransportImplementation).to(AmazonTransportImplementation).inSingletonScope();
            container.bind(interfaces.TYPES.ITransportInstaller).to(AmazonInstaller).inSingletonScope();
        });
    }

    awsConfig = (awsConfig: AWS.Config, awsAccountId: string) :  AmazonTransport => {
        if (!awsConfig) throw new Error(`Argument 'awsConfig' cannot be null.`);
        if (!awsAccountId) throw new Error(`Argument 'awsAccountId' cannot be null.`);

        this.options.awsConfig = awsConfig;
        this.options.awsAccountId = awsAccountId;
        return this;
    }

    // useLambda = () : AmazonTransport => {
    //     this._options.useLambda = true;
    //     return this;
    // }
}
