import { event, interfaces } from '@triact/message-bus.core';

@event(Symbol.for('EventCreated'))
export class EventCreated implements interfaces.IMessage {
    eventId: string;
}

@event(Symbol.for('CakeBaked'))
export class CakeBaked implements interfaces.IMessage {
    type: string;
}
