# Transport
## AmazonTransport
Install the amazon sdk.
```
npm install aws-sdk
```

The name of the endpoint will be used as incoming queue name in SQS.
```typescript
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
