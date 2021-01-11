import { command } from 'message-bus.core';

@command(Symbol.for('BakeCake'))
export default class BakeCake {
    type: string;
}