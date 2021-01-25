import * as customEnv from 'custom-env';
import { Container } from 'inversify';
import { interfaces } from 'message-bus.core';
import { Composer } from './config/Composer';
import { TYPES } from "./config/Types";
import * as messages from './messages/messages';

customEnv.env(true);

const container = new Container();
const composer = new Composer(container);
const bus = composer.compose();

// bus.publish<EventCreated>(EventCreated, (m: EventCreated) => { 
//     m.eventId = 'blabla'; 
// });

// bus.send<CreateEvent>(CreateEvent, (m: CreateEvent) => {
//     m.eventId = '1';
//     m.name = 'Test event';
// });

bus.send<messages.commands.BakeCake>(messages.commands.BakeCake, (m: messages.commands.BakeCake) => {
    m.type = 'Chocolate Cake';
});
