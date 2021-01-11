import * as customEnv from 'custom-env';
import { Container } from 'inversify';
import { interfaces } from 'message-bus.core';
import { Composer } from './Config/Composer';
import { TYPES } from "./Config/Types";
import EventCreatedConsumer from './Consumers/EventCreatedConsumer';
import EventCreated from './Messages/EventCreated';


console.log("Starting...");

customEnv.env(true);

console.log("### Process:", process.env.AWS_PROFILE)



//AWS.config.credentials = awsCredentials;
//AWS.config.update({region: 'eu-west-1'});



const container = new Container();
const composer = new Composer(container);
composer.compose();

const bus = container.get<interfaces.IBus>(TYPES.IBus);

var consumer = new EventCreatedConsumer();

bus.publish<EventCreated>(EventCreated, (m: EventCreated) => {
    m.eventId = 'blabla';
});
