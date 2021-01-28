# message-bus
Easy messaging library to send/publish and handle messages. Build in support for AWS SQS/SNS as transport.

Extendable on the following components:
- Transport 
- Logging

## Installing
Using npm:
```bash
npm install @triact/message-bus.core
```

## Creating an endpoint
Endpoint is the entry point of the framework. You first create an endpoint with an unique name. 
And endpoint can be started (both message sending/publishing and handling) as weel as sendOnly (only message sending).
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
    handling.handleMessages<MyMessage>(MyMessage, MyMessageHandler);
});

// Customizations in the DI container
endpoint.customize(container => {
    //container.bind(Symbol.for('MyService')).to(MyService);
});

// start endpoint with message handling enabled, or start without message handling
let bus = endpoint.start();
//let bus = endpoint.sendOnly();
```

### Transports
#### AmazonTransport
Install the amazon sdk.
```
npm install aws-sdk
```

The name of the endpoint will be used as incoming queue name in SQS.
```
const awsCredentials = new AWS.SharedIniFileCredentials({ profile: 'my-profile' });
const awsConfig = new AWS.Config();
awsConfig.update({
    credentials: awsCredentials,
    region: 'eu-west-1'
});

endpoint.useTransport<AmazonTransport>(AmazonTransport, transport => {
    let awsAccountId = '123456789';
    transport.awsConfig(awsConfig, awsAccountId);
});
```
#### Creating a custom transport
Docs coming soon

### Creating Messages

#### Command
```
import { command } from '@triact/message-bus.core';

// Decorate with the command decorator and provide a system global unique identier to uniquely identify the command in the system.
@command(Symbol.for('MyCommand'))
export class MyCommand {
    value: string = '';
}
```

#### Event
```
import { event } from '@triact/message-bus.core';

// Decorate with the event decorator and provide a system global unique name of the event to uniquely identify the event in the system.
@event(Symbol.for('MyEvent'))
export class MyEvent {
    value: string = '';
}
```

### Creating Handlers
Create a new class and implement interface ```IHandleMessages<T>```
```
import { interfaces } from '@triact/message-bus.core';
import { MyCommand } from '../messages/commands/MyCommand';

export class MyMessageHandler implements interfaces.IHandleMessages<MyCommand> {
    handle = async (msg: MyCommand, context: interfaces.IMessageContext) => {
        console.log(`Handle your message here. value=${msg.value}`);
    }
}
```
