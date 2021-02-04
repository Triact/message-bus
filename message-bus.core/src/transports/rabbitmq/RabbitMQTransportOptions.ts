import { injectable } from "inversify";

@injectable()
export class RabbitMQTransportOptions {
    url:string = '';
}