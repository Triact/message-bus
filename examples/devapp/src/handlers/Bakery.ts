import { inject, injectable, interfaces as inversifyInterfaces } from 'inversify';
import NotificationService from '../services/NotificationService';
import { interfaces } from 'message-bus.core';
import * as messages from '../messages/messages';

@injectable()
export default class Bakery implements interfaces.IHandleMessages<messages.commands.BakeCake> {
    
    private notificationService: NotificationService;

    constructor(
        @inject(Symbol.for('NotificationService')) notificationService: NotificationService
    ) {
        if (!notificationService) throw new Error(`Argument 'notificationService' cannot be null.`);
        this.notificationService = notificationService;
    }

    handle = async (msg: messages.commands.BakeCake, context: interfaces.IMessageContext) => {
        this.notificationService.notify(`Baking cake ${msg.type}`);
        console.log('Messageheaders:', context.messageHeaders);

        context.publish<messages.events.CakeBaked>(messages.events.CakeBaked, m => {
            m.type = msg.type;
        });
    }
}