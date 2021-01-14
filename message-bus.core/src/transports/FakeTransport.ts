import * as interfaces from "../interfaces";

export class FakeTransport implements interfaces.ITransportImplementation {
    
    createConsumers(): void {
        throw new Error("Method not implemented.");
    }
    
    publish = <T>(msg: T, msgType: string, topic: string) => {
        console.log(`FAKE TRANSPORT: publish message ${msgType} to ${topic}.\n${JSON.stringify(msg)}`);
    }

    send = <T>(msg: T, msgType: string, topic: string) => {
        console.log(`FAKE TRANSPORT: send message ${msgType} to ${topic}.\n${JSON.stringify(msg)}`);
    }
}
