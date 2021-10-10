import { inject } from 'inversify';
import * as interfaces from './interfaces';
import Bus from './Bus';

export default class MessageContext implements interfaces.IMessageContext {

    private bus: Bus;

    constructor(bus: Bus) {
        if (!bus) throw new Error(`Argument 'bus' cannot be null.`);
        this.bus = bus;
    }

    //#region IMessageContext implementation
    messageHeaders: interfaces.MessageHeaderMap = {}

    async send<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): Promise<void> {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);

        this.bus.send(msgCtor, populateMessageCallback)
    }

    async publish<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): Promise<void> {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);

        this.bus.publish(msgCtor, populateMessageCallback);
    }
    //#endregion

    addHeader = (key: string, value: string) => {
        this.messageHeaders[key] = value;
    }
}
