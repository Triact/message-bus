import { Context } from 'aws-lambda';

export const context = () : Context => { 
    return {
        callbackWaitsForEmptyEventLoop: false,
        functionName: '',
        functionVersion: '',
        invokedFunctionArn: '',
        memoryLimitInMB: '',
        awsRequestId: '',
        logGroupName: '',
        logStreamName: '',
        //identity?: CognitoIdentity;
        //clientContext?: ClientContext;
        getRemainingTimeInMillis: () => 0,
        done: (error?: Error, result?: any): void => {},
        fail: (error: Error | string): void => {},
        succeed: (messageOrObject: any): void => {},
    }
}