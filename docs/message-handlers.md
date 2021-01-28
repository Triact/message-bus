# Message Handlers
Create a new class and implement interface ```IHandleMessages<T>```
```typescript
import { interfaces } from '@triact/message-bus.core';
import { MyCommand } from '../messages/commands/MyCommand';

export class MyMessageHandler implements interfaces.IHandleMessages<MyCommand> {
    handle = async (msg: MyCommand, context: interfaces.IMessageContext) => {
        console.log(`Handle your message here. value=${msg.value}`);
    }
}
```