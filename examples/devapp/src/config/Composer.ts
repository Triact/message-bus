import { Endpoint, FakeTransport, interfaces, RabbitMQTransport } from '@triact/message-bus.core';
import * as AWS from 'aws-sdk';
import { Container } from "inversify";
//import Bakery from '../handlers/Bakery';
import EventCreator from '../handlers/EventCreator';
import { CreateEvent } from '../messages/commands';
import NotificationService from '../services/NotificationService';

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
        // endpoint.useTransport<AmazonTransport>(AmazonTransport, transport => {
        //     transport
        //         .awsConfig(awsConfig, process.env.AWS_ACCOUNT_ID as string);
        // });
        endpoint.useTransport<FakeTransport>(FakeTransport, transport => {
            
        });
        endpoint.useTransport<RabbitMQTransport>(RabbitMQTransport, transport =>{
            transport.configure('amqp://localhost');
        })
        endpoint.routes(routing => {
            
            //routing.routeToTopic<EventCreated>(EventCreated, 'tijdprikker_event-created');
            //routing.routeToEndpoint<CreateEvent>(CreateEvent, 'tijdprikker_SlackNotifier');           
            routing.routeToEndpoint<CreateEvent>(CreateEvent, 'dev-simplequeue');
        });
        endpoint.handlers(handling => {
            handling.handleMessages<CreateEvent>(CreateEvent, EventCreator)
            //handling.handleMessages<messages.commands.BakeCake>(messages.commands.BakeCake, Bakery);
        });
        endpoint.customize(container => {
            container.bind(Symbol.for('NotificationService')).to(NotificationService);
        });

        return endpoint.start();
        //return endpoint.sendOnly();
    }
}
