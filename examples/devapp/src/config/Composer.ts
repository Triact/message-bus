import * as AWS from 'aws-sdk';
import { Container } from "inversify";
import { Endpoint, FakeTransport, AmazonTransport, interfaces } from 'message-bus.core';
import Bakery from '../handlers/Bakery';
import EventCreator from '../handlers/EventCreator';
import CreateEvent from '../messages/CreateEvent';
import { TYPES } from "./types";

export class Composer {

    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    compose = () => {
        // AWS configuration
        const awsCredentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });
        const awsConfig = new AWS.Config();
        awsConfig.update({
            credentials: awsCredentials,
            region: process.env.AWS_REGION
        });

        const endpoint = new Endpoint('dev-endpoint-queue');
        endpoint.useExistingContainer(this.container);
        //endpoint.useTransport<AmazonTransport>(new AmazonTransport(awsConfig));
        endpoint.useTransport<AmazonTransport>(new AmazonTransport({
            awsConfig: awsConfig,
            useLambda: false
        }));
        endpoint.routes(routing => {
            //routing.routeToTopic<EventCreated>(EventCreated, `arn:aws:sns:${awsConfig.region}:${process.env.AWS_ACCOUNT_ID}:tijdprikker_event-created`);
            //routing.routeToEndpoint<CreateEvent>(CreateEvent, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/tijdprikker_SlackNotifier`);            
            routing.routeToEndpoint<CreateEvent>(CreateEvent, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/dev-simplequeue`);
        });
        endpoint.handlers(handling => {
            handling.handleMessages<CreateEvent>(CreateEvent, new EventCreator())
            //handling.handleMessages<BakeCake>(BakeCake, new Bakery());
        });

        console.log("dikke pik");
        const bus = endpoint.start();

        this.container.bind<interfaces.IBus>(TYPES.IBus).toConstantValue(bus);
    }
}
