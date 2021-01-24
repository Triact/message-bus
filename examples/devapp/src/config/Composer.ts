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

        const endpoint = new Endpoint('dev-simplequeue');
        endpoint.useExistingContainer(this.container);
        endpoint.useTransport<AmazonTransport>(AmazonTransport, transport => {
            transport
                .awsConfig(awsConfig, process.env.AWS_ACCOUNT_ID as string);
        });
        endpoint.routes(routing => {
            //routing.routeToTopic<EventCreated>(EventCreated, 'tijdprikker_event-created');
            //routing.routeToEndpoint<CreateEvent>(CreateEvent, 'tijdprikker_SlackNotifier');            
            routing.routeToEndpoint<CreateEvent>(CreateEvent, 'dev-simplequeue');
            routing.routeToEndpoint<BakeCake>(BakeCake, 'dev-simplequeue');
        });
        endpoint.handlers(handling => {
            handling.handleMessages<CreateEvent>(CreateEvent, EventCreator)
            handling.handleMessages<BakeCake>(BakeCake, Bakery);
        });
        endpoint.customize(container => {
            container.bind(Symbol.for('NotificationService')).to(NotificationService);
        })

        //return endpoint.start();
        return endpoint.sendOnly();
    }
}
