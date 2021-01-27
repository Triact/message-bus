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

## Manual

### import
```TypeScript
import messageBus from '@triact/message-bus.core';
```

### Create an endpoint
Endpoint is the entry point of the framework. You first create an endpoint with an unique name. The name of the endpoint will be used as incoming queue name in the AmazonTransport.
And endpoint can be started (both message sending/publishing and handling) as weel as sendOnly (only message sending).
```TypeScript
let endpoint = new messageBus.Endpoint('my-endpoint');
endpoint.start();
// endproint.sendOnly();

```
