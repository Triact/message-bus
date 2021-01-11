import * as AWS from 'aws-sdk';
import { Container } from "inversify";
import { AmazonTransport, Endpoint, interfaces } from 'message-bus.core';
import EventCreated from "../Messages/EventCreated";
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

        const endpoint = new Endpoint();
        endpoint.useTransport<AmazonTransport>(new AmazonTransport(awsConfig));
        endpoint.routes(routing => {
            routing.routeToTopic<EventCreated>(EventCreated, `arn:aws:sns:${awsConfig.region}:${process.env.AWS_ACCOUNT_ID}:tijdprikker_event-created`);
        });
        const bus = endpoint.start();

        this.container.bind<interfaces.IBus>(TYPES.IBus).toConstantValue(bus);
    }
}
