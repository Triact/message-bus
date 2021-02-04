import { interfaces as inversifyInterfaces } from 'inversify';
import { RabbitMQransportImplementation, RabbitMQTransportOptions, TYPES } from '.';
import * as interfaces from "../../interfaces";

export class RabbitMQTransport implements interfaces.ITransport {

    private readonly _options: RabbitMQTransportOptions = new RabbitMQTransportOptions();
    
    constructor(visitor: interfaces.ITransportConfigurationVisitor) {

        visitor.configureTransport((container: inversifyInterfaces.Container) => {
            container.bind(TYPES.RabbitMQTransportOptions).toConstantValue(this._options);
            container.bind(interfaces.TYPES.ITransportImplementation).to(RabbitMQransportImplementation).inSingletonScope();
        });
    }


    configure = (url: string) : RabbitMQTransport => {
        this._options.url = url;
        
        return this;
    }

    // awsConfig = (awsConfig: AWS.Config, awsAccountId: string) :  AmazonTransport => {
    //     if (!awsConfig) throw new Error(`Argument 'awsConfig' cannot be null.`);
    //     if (!awsAccountId) throw new Error(`Argument 'awsAccountId' cannot be null.`);

    //     this._options.awsConfig = awsConfig;
    //     this._options.awsAccountId = awsAccountId;
    //     return this;
    // }

    // useLambda = () : AmazonTransport => {
    //     this._options.useLambda = true;
    //     return this;
    // }
}
