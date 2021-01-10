import { Container } from "inversify";
import { TYPES } from "./types";
import { interfaces, Endpoint, AmazonTransport, FakeTransport } from 'message-bus.core';
import EventCreated from '../messages/EventCreated';
import CreateEvent from '../messages/CreateEvent';
import EventCreator from '../handlers/EventCreator';
import * as AWS from 'aws-sdk';

export class Composer {

    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    compose = () => {
        // AWS configuration
        const awsCredentials = new AWS.SharedIniFileCredentials({profile: process.env.AWS_PROFILE});
        const awsConfig = new AWS.Config();
        awsConfig.update({
            credentials: awsCredentials,
            region: process.env.AWS_REGION
        });

        const endpoint = new Endpoint();
        //endpoint.useTransport<AmazonTransport>(new AmazonTransport(awsConfig));
        endpoint.useTransport<FakeTransport>(new FakeTransport());
        endpoint.routes(routing => {
            routing.routeToTopic<EventCreated>(EventCreated, `arn:aws:sns:${awsConfig.region}:${process.env.AWS_ACCOUNT_ID}:tijdprikker_event-created`);
            routing.routeToEndpoint<CreateEvent>(CreateEvent, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/tijdprikker_SlackNotifier`);
        });
        endpoint.handlers(handling => {
            handling.handleMessages<CreateEvent>(CreateEvent, new EventCreator())
        });
        const bus = endpoint.sendOnly();

        this.container.bind<interfaces.IBus>(TYPES.IBus).toConstantValue(bus);
    }
}
