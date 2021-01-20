import * as customEnv from 'custom-env';
import { Container } from 'inversify';
import { interfaces } from 'message-bus.core';
import { Composer } from './config/Composer';
import { TYPES } from "./config/Types";
import CreateEvent from './messages/CreateEvent';


console.log("Starting...");

customEnv.env(true);

//AWS.config.credentials = awsCredentials;
//AWS.config.update({region: 'eu-west-1'});



const container = new Container();
const composer = new Composer(container);
const bus = composer.compose();

const bus1 = container.get<interfaces.IBus>(interfaces.TYPES.Bus);

// bus.publish<EventCreated>(EventCreated, (m: EventCreated) => { 
//     m.eventId = 'blabla'; 
// });

// bus.send<CreateEvent>(CreateEvent, (m: CreateEvent) => {
//     m.eventId = '1';
//     m.name = 'Test event';
// })
