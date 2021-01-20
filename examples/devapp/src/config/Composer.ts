import * as AWS from 'aws-sdk';
import { Container } from "inversify";
import { Endpoint, FakeTransport, AmazonTransport, interfaces } from 'message-bus.core';
import Bakery from '../handlers/Bakery';
import EventCreator from '../handlers/EventCreator';
import BakeCake from '../messages/BakeCake';
import CreateEvent from '../messages/CreateEvent';
import NotificationService from '../services/NotificationService';
import { TYPES } from "./types";

export class Composer {

    private container: Container;

    constructor(container: Container) {
        this.container = container;
    }

    compose = () : interfaces.IBus => {
        // AWS configuration
        const awsCredentials = new AWS.SharedIniFileCredentials({ profile: process.env.AWS_PROFILE });
        const awsConfig = new AWS.Config();
        awsConfig.update({
            credentials: awsCredentials,
            region: process.env.AWS_REGION
        });

        const endpoint = new Endpoint('dev-endpoint-queue');
        endpoint.useExistingContainer(this.container);
        endpoint.useTransport<AmazonTransport>(AmazonTransport, transport => {
            transport
                .awsConfig(awsConfig)
                .useLambda();
        });                
        endpoint.routes(routing => {
            //routing.routeToTopic<EventCreated>(EventCreated, `arn:aws:sns:${awsConfig.region}:${process.env.AWS_ACCOUNT_ID}:tijdprikker_event-created`);
            //routing.routeToEndpoint<CreateEvent>(CreateEvent, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/tijdprikker_SlackNotifier`);            
            //routing.routeToEndpoint<CreateEvent>(CreateEvent, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/dev-simplequeue`);
            //routing.routeToEndpoint<BakeCake>(BakeCake, `https://sqs.${awsConfig.region}.amazonaws.com/${process.env.AWS_ACCOUNT_ID}/dev-simplequeue`);
        });
        endpoint.handlers(handling => {
            //handling.handleMessages<CreateEvent>(CreateEvent, new EventCreator())
            handling.handleMessages<BakeCake>(BakeCake, Bakery);
        });
        endpoint.customize(container => {
            container.bind(Symbol.for('NotificationService')).to(NotificationService);
        })

        return endpoint.start();
    }
}
