import { handleWithMessageBus } from '../handler';
import { SQSEvent, Context, Callback } from 'aws-lambda';
import * as context from 'aws-lambda-mock-context';

test('correct event handler', async () => {
    const event:SQSEvent = {
        Records: []
    };
    const ctx:Context = context();
    const callback:Callback = jest.fn();

    await handleWithMessageBus(event, ctx, callback);
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, 'OK');
});
