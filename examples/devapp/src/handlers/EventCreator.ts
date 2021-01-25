import { inject, injectable } from 'inversify';
import { interfaces } from 'message-bus.core';
import NotificationService from '../services/NotificationService';
import * as messages from '../messages/messages';

@injectable()
export default class EventCreator implements interfaces.IHandleMessages<messages.commands.CreateEvent>{

    public handle = async (msg: messages.commands.CreateEvent) => {
        console.log('Create Event', msg);
    }
}