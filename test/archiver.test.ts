import { App, Stack } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DailyCloudWatchLogArchiver } from '../src';

describe('DailyCloudWatchLogArchiver Testing', () => {
  const app = new App();
  const stack = new Stack(app, 'TestingStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
  });

  new DailyCloudWatchLogArchiver(stack, 'DailyCloudWatchLogArchiver', {
    schedules: [
      {
        name: 'example-log-archive-1st-rule',
        description: 'example log archive 1st rule.',
        target: {
          logGroupName: 'example-log-1st-group',
          destinationPrefix: 'example-1st-log',
        },
      },
      {
        name: 'example-log-archive-2nd-rule',
        description: 'example log archive 2nd rule.',
        target: {
          logGroupName: 'example-log-2nd-group',
          destinationPrefix: 'example-2nd-log',
        },
      },
    ],
  });

  const template = Template.fromStack(stack);

  describe('Bucket Testing', () => {

    it('Should have bucket encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'aws:kms',
              },
            },
          ],
        }),
      });
    });

    it('Should have bucket resource policy', () => {
      template.hasResourceProperties('AWS::S3::BucketPolicy', {
        PolicyDocument: {
          Version: '2012-10-17',
          Statement: Match.arrayWith([
            Match.objectEquals({
              Effect: 'Allow',
              Action: 's3:GetBucketAcl',
              Principal: {
                Service: 'logs.us-east-1.amazonaws.com',
              },
              Resource: {
                'Fn::GetAtt': [
                  Match.stringLikeRegexp('DailyCloudWatchLogArchiverLogArchiveBucket'),
                  'Arn',
                ],
              },
            }),
            Match.objectEquals({
              Effect: 'Allow',
              Action: 's3:PutObject',
              Principal: {
                Service: 'logs.us-east-1.amazonaws.com',
              },
              Resource: {
                'Fn::Join': [
                  '',
                  [
                    {
                      'Fn::GetAtt': [
                        Match.stringLikeRegexp('DailyCloudWatchLogArchiverLogArchiveBucket'),
                        'Arn',
                      ],
                    },
                    '/*',
                  ],
                ],
              },
              Condition: {
                StringEquals: {
                  's3:x-amz-acl': 'bucket-owner-full-control',
                },
              },
            }),
          ]),
        },
      });
    });

  });

  describe('Lambda Testing', () => {

    it('Should have lambda execution role', () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('daily-cw-log-archiver-lambda-exec-.*-role'),
        AssumeRolePolicyDocument: Match.objectEquals({
          Version: '2012-10-17',
          Statement: Match.arrayWith([
            Match.objectEquals({
              Effect: 'Allow',
              Principal: {
                Service: 'lambda.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            }),
          ]),
        }),
        ManagedPolicyArns: Match.arrayWith([
          {
            'Fn::Join': Match.arrayEquals([
              '',
              Match.arrayEquals([
                'arn:',
                {
                  Ref: 'AWS::Partition',
                },
                ':iam::aws:policy/service-role/AWSLambdaBasicExecutionRole',
              ]),
            ]),
          },
        ]),
        Policies: Match.arrayEquals([
          {
            PolicyName: 'log-export-policy',
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: [
                Match.objectEquals({
                  Effect: 'Allow',
                  Action: 'logs:CreateExportTask',
                  Resource: '*',
                }),
              ],
            }),
          },
          {
            PolicyName: 'put-bucket-policy',
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: [
                Match.objectEquals({
                  Effect: 'Allow',
                  Action: Match.arrayEquals([
                    's3:GetBucketAcl',
                    's3:PutObject',
                  ]),
                  Resource: {
                    'Fn::GetAtt': Match.arrayEquals([
                      Match.stringLikeRegexp('DailyCloudWatchLogArchiverLogArchiveBucket.*'),
                      'Arn',
                    ]),
                  },
                }),
              ],
            }),
          },
        ]),
      }));
    });

    it('Should have lambda function', () => {
      template.hasResourceProperties('AWS::Lambda::Function', Match.objectEquals({
        FunctionName: Match.stringLikeRegexp('daily-cw-log-archiver-.*-func'),
        Handler: 'index.handler',
        Runtime: 'nodejs18.x',
        Code: {
          S3Bucket: Match.anyValue(),
          S3Key: Match.stringLikeRegexp('.*.zip'),
        },
        Description: Match.anyValue(),
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            BUCKET_NAME: {
              Ref: Match.stringLikeRegexp('DailyCloudWatchLogArchiverLogArchiveBucket.*'),
            },
          },
        },
        Role: {
          'Fn::GetAtt': [
            Match.stringLikeRegexp('DailyCloudWatchLogArchiverLambdaExecutionRole.*'),
            'Arn',
          ],
        },
      }));
    });
  });

  // todo: scheduler property.
  it('Should have Schedule', () => {
    template.hasResourceProperties('AWS::Scheduler::ScheduleGroup', Match.objectEquals({
      Name: Match.stringLikeRegexp('log-archive-schedule-.*-group'),
    }));
    template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
      Name: Match.anyValue(),
      Description: Match.anyValue(),
      GroupName: Match.stringLikeRegexp('log-archive-schedule-.*-group'),
      State: 'ENABLED',
      FlexibleTimeWindow: {
        Mode: 'OFF',
      },
      ScheduleExpressionTimezone: 'UTC',
      ScheduleExpression: Match.stringLikeRegexp('cron(.* 13 * * ? *)'),
      Target: Match.objectEquals({
        Arn: {
          'Fn::GetAtt': [
            Match.stringLikeRegexp('DailyCloudWatchLogArchiverLogArchiveFunction.*'),
            'Arn',
          ],
        },
        RoleArn: {
          'Fn::GetAtt': [
            Match.stringLikeRegexp('DailyCloudWatchLogArchiverSchedulerExecutionRole.*'),
            'Arn',
          ],
        },
        Input: Match.stringLikeRegexp('{"logGroupName":"example-log-.*-group","destinationPrefix":"example-.*-log"}'),
        RetryPolicy: {
          MaximumEventAgeInSeconds: 60,
          MaximumRetryAttempts: 0,
        },
      }),
    }));
    template.resourceCountIs('AWS::Scheduler::Schedule', 2);
  });

  it('Should match snapshot', () => {
    expect(template.toJSON()).toMatchSnapshot('archiver');
  });
});
