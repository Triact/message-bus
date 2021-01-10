import { event } from 'message-bus.core';

@event(Symbol.for('Eventcreated'))
export default class EventCreated {
    eventId: string;
}
