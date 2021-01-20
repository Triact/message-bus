import { handle } from '../messageBusHandler';
import { SQSEvent, Context, Callback } from 'aws-lambda';
import { context } from '../__testmocks__/AwsLambdaMocks';

test('correct event handler', async () => {
    const event:SQSEvent = {
        Records: []
    };
    const ctx:Context = context();
    const callback:Callback = jest.fn();

    await handle(event, ctx, callback);
    
    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(null, 'OK');
});
