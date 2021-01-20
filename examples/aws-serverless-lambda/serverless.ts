import type { AWS } from '@serverless/typescript';

const serverlessConfiguration: AWS = {
  service: 'aws-serverless-lambda',
  frameworkVersion: '2',
  useDotenv: true,
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    stage: 'dev',
    runtime: 'nodejs12.x',
    region: 'eu-west-1'
  },
  functions: {
    handleWithMessageBus: {
      handler: 'messageBusHandler.handle',
      events: [{
        sqs: {
          arn: {
            'Fn::GetAtt': ['EndpointQueue', 'Arn']
          },
          batchSize: 1,
        }
      }]
    }
  },
  resources: {
    Resources: {
      EndpointQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          //QueueName: endpointQueueName,
          QueueName: '${env:ENDPOINT_QUEUE_NAME}',
          RedrivePolicy: {
            deadLetterTargetArn: {
              'Fn::GetAtt': ['EndpointErrorQueue', 'Arn']
            },
            maxReceiveCount: 1
          }
        },        
      },
      EndpointQueuePolicy: {
        Type: "AWS::SQS::QueuePolicy",
        Properties: {
          Queues: [{
            'Ref': 'EndpointQueue'
          }],
          PolicyDocument: {
            Statement: [{
              Sid: 'Allow-SNS-SendMessage',
              Effect: 'Allow',
              Principal: '*',
              Action: [
                'sqs:SendMessage'
              ],
              Resource: '*',
              // {
              //   'Fn::GetAtt': ['EndpointQueue', 'Arn']
              // },
              Condition: {
                ArnEquals: {
                  //'aws:SourceArn': snsTopicArn_EventCreated
                  'aws:SourceArn': '${env:SNS_TOPIC_ARN__EVENT_CREATED}',
                }
              }
            }]
          }
        }
      },
      EndpointErrorQueue: {
         Type: 'AWS::SQS::Queue',
         Properties: {
           //QueueName: endpointErrorQueueName,
           QueueName: '${env:ENDPOINT_QUEUE_NAME}-error',
           MessageRetentionPeriod: 1209600 // 14 days in seconds
         }
      },
      // Event Subscriptions
      SnsSubscriptionEventCreated: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Protocol: 'sqs',
          //TopicArn: snsTopicArn_EventCreated,
          TopicArn: '${env:SNS_TOPIC_ARN__EVENT_CREATED}',
          Endpoint: {
            'Fn::GetAtt': ['EndpointQueue', 'Arn']
          }          
        }
      }
    }  
  }
}

module.exports = serverlessConfiguration;
