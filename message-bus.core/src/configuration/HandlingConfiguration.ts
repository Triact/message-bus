import { interfaces as inversifyInterfaces } from 'inversify';
import { MessageHelper } from '../helpers/MessageHelper';
import * as interfaces from '../interfaces';

export default class HandlingConfiguration implements interfaces.IHandlingConfiguration, interfaces.IProvideMessageHandlers {

    private container: inversifyInterfaces.Container;
    
    constructor(container: inversifyInterfaces.Container) {
        if (!container) throw new Error(`Argument 'container' cannot be null.`)
        this.container = container;
    }

    handleMessages = <T>(msgCtor: new (...args: any[]) => T, handlerCtor: new (...args: any[]) => interfaces.IHandleMessages<T>) => {

        if (!msgCtor) throw new Error(`Argument 'msgCtor' cannot be null.`);
        if (!handlerCtor) throw new Error(`Argument 'handler' cannot be null.`);

        let msg = new msgCtor();
        let msgType = MessageHelper.getMessageType(msg);

        this.container.bind(msgType).to(handlerCtor);
    }
    
    getHandlersForMessageType<T>(msgType: interfaces.MessageType): interfaces.IHandleMessages<T>[] {
        if (!this.container.isBound(msgType)) throw new Error(`Message handler for message '${msgType.toString()}' not found.`);
        return this.container.getAll<interfaces.IHandleMessages<T>>(msgType);
    }
}