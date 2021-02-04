// import { interfaces } from '@triact/message-bus.core';
// import { IHandleMessages } from '@triact/message-bus.core/dist/interfaces';
// import { inject, injectable } from 'inversify';
// import * as messages from '../messages/messages';
// import NotificationService from '../services/NotificationService';

// @injectable()
// export default class Bakery implements IHandleMessages<messages.commands.BakeCake> {
    
//     private notificationService: NotificationService;

//     constructor(
//         @inject(Symbol.for('NotificationService')) notificationService: NotificationService
//     ) {
//         if (!notificationService) throw new Error(`Argument 'notificationService' cannot be null.`);
//         this.notificationService = notificationService;
//     }

//     handle = async (msg: messages.commands.BakeCake, context: interfaces.IMessageContext) => {
//         this.notificationService.notify(`Baking cake ${msg.type}`);
//         console.log('Messageheaders:', context.messageHeaders);

//         context.publish<messages.events.CakeBaked>(messages.events.CakeBaked, m => {
//             m.type = msg.type;
//         });
//     }
// }