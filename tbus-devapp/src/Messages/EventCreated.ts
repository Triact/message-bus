import { _event } from 'tbus';

@_event(Symbol.for('Eventcreated'))
export default class EventCreated {
    eventId: string;
}
