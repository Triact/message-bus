import { interfaces } from 'message-bus.core';
import CreateEvent from '../messages/CreateEvent';


export default class EventCreator implements interfaces.IHandleMessages<CreateEvent>{
    
    handle = (msg: CreateEvent) => {
        throw new Error('Method not implemented.');
    }
}