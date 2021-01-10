import { interfaces } from 'message-bus.core';
import CreateEvent from '../Messages/CreateEvent';


export default class EventCreator implements interfaces.IHandleMessages<CreateEvent>{
    
    handle<T>(msg: T): void {
        throw new Error('Method not implemented.');
    }
}