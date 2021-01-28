# Messages

## Command
```typescript
import { command } from '@triact/message-bus.core';

// Decorate with the command decorator and provide a system global unique identier to uniquely identify the command in the system.
@command(Symbol.for('MyCommand'))
export class MyCommand {
    value: string = '';
}
```

## Event
```typescript
import { event } from '@triact/message-bus.core';

// Decorate with the event decorator and provide a system global unique name of the event to uniquely identify the event in the system.
@event(Symbol.for('MyEvent'))
export class MyEvent {
    value: string = '';
}
```
