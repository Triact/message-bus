import { command, interfaces } from '@triact/message-bus.core';

@command(Symbol.for('CreateEvent'))
export class CreateEvent implements interfaces.IMessage {
    eventId: string;
}

@command(Symbol.for('BakeCake'))
export class BakeCake implements interfaces.IMessage {
    type: string;
}

