import { inject, injectable } from 'inversify';
import { interfaces } from 'message-bus.core';
import CreateEvent from '../messages/CreateEvent';
import NotificationService from '../services/NotificationService';

@injectable()
export default class EventCreator implements interfaces.IHandleMessages<CreateEvent>{

    public handle = async (msg: CreateEvent) => {
        console.log('Create Event', msg);
    }
}