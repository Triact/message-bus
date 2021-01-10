import { MessageHelper } from '../helpers/MessageHelper';
import * as interfaces from '../interfaces';

export default class HandlingConfiguration implements interfaces.IHandlingConfiguration {
    private handlers: any = {};

    handleMessages = <T>(msgCtor: new(...args: any[]) => T, handler: interfaces.IHandleMessages<T>) => {
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

    areRegistered = () => {
        return false;
    }
}