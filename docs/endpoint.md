# Endpoint
Endpoint is the entry point of the framework.
Create an new Endpoint with an unique name. The name will be used as incoming queue name for the configured transport. See the transport specific documentation for the details.

When an endpoint is strated, the endpoint is capable of message sending/publishing and message handling.
If handling messages is not required you can start the endpoint as ```.sendOnly()``` which will disbale message handling.

```TypeScript
import { Endpoint, FakeTransport, ConsoleLogger } from '@triact/message-bus.core';

let endpoint = new Endpoint('my-endpoint');

// optional: configure custom inversify container used for dependency injection registry
//endpoint.useExistingContainer(container);

// configure logger. ConsoleLogger is enabled by default.
//endpoint.useLogger<ConsoleLogger>(ConsoleLogger);

// configure the transport of your choise. Default FakeTransport is configured for testing purposes.
endpoint.useTransport<FakeTransport>(FakeTransport, transport => {
    // configure the transport here.
    //transport.
}); 

// configure routes for outgoing messages
endpoint.routes(routing => {
    // destination for outgoing commands
    routing.routeToEndpoint<MyCommand>(MyCommand, 'destination-queue-name');
    // destination for events 
    routing.routeToTopic<MyEvent>(MyEvent, 'destination-topic-name');
});

// configure message handlers. Message to handle can be both a command of event.
endpoint.handlers(handling => {
    handling.handleMessages<MyCommand>(MyCommand, MyMessageHandler);
});

// Customizations in the DI container
endpoint.customize(container => {
    //container.bind(Symbol.for('MyService')).to(MyService);
});

// start endpoint with message handling enabled, or start without message handling
let bus = endpoint.start();
//let bus = endpoint.sendOnly();
```