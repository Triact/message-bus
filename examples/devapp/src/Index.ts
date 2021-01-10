import { interfaces } from 'message-bus.core';
import EventCreated from './messages/EventCreated';
import CreateEvent from './messages/CreateEvent';
import { TYPES } from "./config/Types";
import { Container } from 'inversify';
import { Composer } from './config/Composer';
import * as AWS from 'aws-sdk';
import * as customEnv from 'custom-env';


console.log("Starting...");

customEnv.env(true);

//AWS.config.credentials = awsCredentials;
//AWS.config.update({region: 'eu-west-1'});



const container = new Container();
const composer = new Composer(container);
composer.compose();

const bus = container.get<interfaces.IBus>(TYPES.IBus);

// bus.publish<EventCreated>(EventCreated, (m: EventCreated) => { 
//     m.eventId = 'blabla'; 
// });

bus.send<CreateEvent>(CreateEvent, (m: CreateEvent) => {
    m.eventId = '1';
    m.name = 'Test event';
})
