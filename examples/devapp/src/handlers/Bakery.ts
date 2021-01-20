import { inject, injectable } from 'inversify';
import { IHandleMessages } from 'message-bus.core/dist/interfaces';
import BakeCake from '../messages/BakeCake';
import NotificationService from '../services/NotificationService';
//import BakeCake from '../messages/BakeCake';

@injectable()
export default class Bakery implements IHandleMessages<BakeCake> {
    
    private notificationService: NotificationService;

    constructor(
        @inject(Symbol.for('NotificationService')) notificationService: NotificationService
    ) {
        if (!notificationService) throw new Error(`Argument 'notificationService' cannot be null.`);
        this.notificationService = notificationService;
    }

    handle = async (msg: BakeCake) => {
        this.notificationService.notify(`Baking cake ${msg.type}`);
    }
}