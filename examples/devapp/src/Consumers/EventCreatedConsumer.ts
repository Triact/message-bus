import { interfaces, register } from "message-bus.core";
import EventCreated from "../Messages/EventCreated";


@register("EventCreated")
export default class EventCreatedConsumer implements interfaces.IConsumer<EventCreated>, interfaces.IConsumerBase {

    handle(msg: EventCreated): Promise<void> {
        throw new Error("Method not implemented.");
    }
}