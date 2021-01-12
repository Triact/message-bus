import { MessageHelper } from '../helpers/MessageHelper';
import * as interfaces from '../interfaces';

export default class HandlingConfiguration implements interfaces.IHandlingConfiguration, interfaces.IProvideMessageHandler {

    private handlers: any = {};

    handleMessages = <T>(msgCtor: new (...args: any[]) => T, handler: interfaces.IHandleMessages<T>) => {
        if (!msgCtor) throw new Error(`Argument 'msgCtor' cannot be null.`);
        if (!handler) throw new Error(`Argument 'handler' cannot be null.`);

        let msg = new msgCtor();
        let msgType = MessageHelper.getMessageType(msg);

        if (this.handlers[msgType] && this.handlers[msgType].includes(handler))
            throw new Error(`Handler already registered for message:${msgType.toString()}`);

        if (!this.handlers[msgType])
            this.handlers[msgType] = [];

        this.handlers[msgType].push(handler);
    }

    getHandlersForMessageType<T>(msgCtor: new (...args: any[]) => T, msgType: symbol): interfaces.IHandleMessages<T>[] {
        console.log('handlers', this.handlers);
        console.log(this.handlers[msgType]);
        console.log(msgCtor, new msgCtor());
        return this.handlers[msgType] as interfaces.IHandleMessages<T>[];
    }


    areRegistered = () => {
        console.log('###', this.handlers);
        return this.handlers.length > 0;
    }
}