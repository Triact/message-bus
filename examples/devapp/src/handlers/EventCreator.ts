import { interfaces } from 'message-bus.core';
import CreateEvent from '../messages/CreateEvent';


export default class EventCreator implements interfaces.IHandleMessages<CreateEvent>{

    public handle = async (msg: CreateEvent) => {
        console.log('Create Event', msg);
    }
}