import { interfaces } from "../interfaces";

export class FakeTransport implements interfaces.ITransport {
    
    publish = <T>(msg: T, msgType: string, topic: string) => {
        console.log(`FAKE TRANSPORT: publish message ${msgType} to ${topic}.\n${JSON.stringify(msg)}`);
    };
}
