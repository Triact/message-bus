import { _event } from 'message-bus.core';

@_event(Symbol.for('Eventcreated'))
export default class EventCreated {
    eventId: string;
}
