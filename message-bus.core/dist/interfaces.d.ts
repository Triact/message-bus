declare namespace interfaces {
    type MessageType = (string | symbol);
    interface IBus {
        publish<T>(ctor: new (...args: any[]) => T, populateMessage: (m: T) => void): void;
    }
    interface ITransport {
        publish<T>(msg: T, msgType: string, topic: string): void;
    }
    interface IRouting {
        routeToTopic<T>(ctor: new (...args: any[]) => T, topic: string): void;
        getDestination<T>(msg: T): {
            msgType: string;
            topic: string;
        };
    }
}
export { interfaces };
