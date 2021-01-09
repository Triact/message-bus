import { command } from 'message-bus.core';

@command(Symbol.for('CreateEvent'))
export default class CreateEvent {
    eventId: string;
    name: string;
}