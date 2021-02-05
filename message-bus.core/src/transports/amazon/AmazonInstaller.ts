import { inject, injectable } from 'inversify';
import { AmazonTransportOptions } from './AmazonTransportOptions';
import * as amazonInterfaces from './interfaces';
import * as interfaces from '../../interfaces';

@injectable()
export class AmazonInstaller implements interfaces.ITransportInstaller {

    private options: AmazonTransportOptions;
    private routeProvider: interfaces.IProvideRoutes;
    private logger: interfaces.ILogger;

    constructor(
        @inject(amazonInterfaces.TYPES.AmazonTransportOptions) options: AmazonTransportOptions,
        @inject(interfaces.TYPES.IProvideRoutes) routeProvider: interfaces.IProvideRoutes,
        @inject(interfaces.TYPES.ILogger) logger: interfaces.ILogger
    ) {
        if (!options) throw new Error(`Argument 'options' cannot be null.`);
        if (!routeProvider) throw new Error(`Argument 'routeProvider' cannot be null.`);
        if (!logger) throw new Error(`Argument 'logger' cannot be null.`);

        this.options = options;
        this.routeProvider = routeProvider;
        this.logger = logger;
    }

    /**
     * Setup AWS SQS and SNS to run this endpoint.
     * - SQS queue is created for the endpoint.
     * - SNS topics are created for all published events.
     * 
     */
    install = () => {
        this.createQueue();
        this.createTopicsForEvents();
        this.subscribeToTopics();
    }

    private createQueue = () => {
        this.logger.debug('Creating SQS queue for endpoint');
    }

    private createTopicsForEvents = () => {
        this.logger.debug('Creating topics for events');
    }

    private subscribeToTopics = () => {
        this.logger.debug('Subscribing SQS queue to SNS topics.');
    }
}