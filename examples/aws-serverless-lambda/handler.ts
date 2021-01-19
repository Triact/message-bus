import { SQSHandler, SQSEvent, Context, Callback } from 'aws-lambda';

export const handleWithMessageBus: SQSHandler = async (sqsEvent: SQSEvent, context: Context, callback: Callback) => {
  console.log('### Handling SQSEvent:', sqsEvent);

  await Promise.all(sqsEvent.Records.map(async (record) => {
    record.messageAttributes['Triact.MessageType']
    const text = record.body;
  }));

  callback(null, 'OK');
}
