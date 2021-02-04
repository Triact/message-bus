import { interfaces } from '@triact/message-bus.core';
import { injectable } from 'inversify';
import * as messages from '../messages/messages';

@injectable()
export default class EventCreator implements interfaces.IHandleMessages<messages.commands.CreateEvent>{

    public handle = async (msg: messages.commands.CreateEvent) => {
        console.log('Create Event', msg);
    }
}