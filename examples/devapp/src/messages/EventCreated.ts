import { event, interfaces } from 'message-bus.core';

@event(Symbol.for('Eventcreated'))
export default class EventCreated implements interfaces.IMessage {
    eventId: string;
}
