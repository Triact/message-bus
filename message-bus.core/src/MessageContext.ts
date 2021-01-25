import { inject } from 'inversify';
import * as interfaces from './interfaces';
import Bus from './Bus';

export default class MessageConext implements interfaces.IMessageContext {

    private bus: Bus;

    constructor(bus: Bus) {
        if (!bus) throw new Error(`Argument 'bus' cannot be null.`);
        this.bus = bus;
    }

    //#region IMessageContext implementation
    messageHeaders: interfaces.MessageHeaderMap = {}

    send<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);

        this.bus.send(msgCtor, populateMessageCallback)
    }

    publish<T>(msgCtor: new (...args: any[]) => T, populateMessageCallback: (m: T) => void): void {
        if (!msgCtor) throw new Error(`Argument 'ctor' cannot be null.`);
        if (!populateMessageCallback) throw new Error(`Argument 'populateMessageCallback' cannot be null`);

        this.bus.publish(msgCtor, populateMessageCallback);
    }
    //#endregion

    addHeader = (key: string, value: string) => {
        this.messageHeaders[key] = value;
    }
}
