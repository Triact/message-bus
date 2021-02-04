import * as customEnv from 'custom-env';
import { Container } from 'inversify';
import { Composer } from './config/Composer';
import { CreateEvent } from './messages/commands';

customEnv.env(true);

const container = new Container();
const composer = new Composer(container);
const bus = composer.compose();

// bus.publish<EventCreated>(EventCreated, (m: EventCreated) => { 
//     m.eventId = 'blabla'; 
// });

bus.send<CreateEvent>(CreateEvent, (m: CreateEvent) => {
    m.eventId = '1';
    //m.name = 'Test event';
});

// bus.send<messages.commands.BakeCake>(messages.commands.BakeCake, (m: messages.commands.BakeCake) => {
//     m.type = 'Chocolate Cake';
// });
