import { SQSHandler, SQSEvent, Context, Callback } from 'aws-lambda';
import { Endpoint, FakeTransport, AmazonTransport, interfaces } from 'message-bus.core';

export const handle: SQSHandler = async (sqsEvent: SQSEvent, context: Context, callback: Callback) => {
  console.log('### Handling SQSEvent:', sqsEvent);

  const endpoint = new Endpoint('dev-lambda-endpoint-queue');
  endpoint.useTransport<FakeTransport>(FakeTransport, transport => {});
  endpoint.routes(routing => {

  });
  endpoint.handlers(handling => {

  });
  const bus = endpoint.sendOnly();

  console.log("### Bus created successfully");

  if (sqsEvent.Records) {
    await Promise.all(sqsEvent.Records.map(async (record) => {
      record.messageAttributes['Triact.MessageType']
      const text = record.body;
    }));
  }

  callback(null, 'OK');
}