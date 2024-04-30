import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { DailyCloudWatchLogsArchiveStack } from '../src';

describe('DailyCloudWatchLogsArchiveStack Testing', () => {
  const app = new App();

  const stack = new DailyCloudWatchLogsArchiveStack(app, 'DailyCloudWatchLogsArchiveStack', {
    env: {
      account: '123456789012',
      region: 'us-east-1',
    },
    targetResourceTag: {
      key: 'DailyLogExport',
      values: ['Yes'],
    },
  });

  const template = Template.fromStack(stack);

  describe('Bucket Testing', () => {

    it('Should have bucket encryption', () => {
      template.hasResourceProperties('AWS::S3::Bucket', {
        BucketEncryption: Match.objectEquals({
          ServerSideEncryptionConfiguration: [
            {
              ServerSideEncryptionByDefault: {
                SSEAlgorithm: 'AES256',
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
                  Match.stringLikeRegexp('LogArchiveBucket.*'),
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
                        Match.stringLikeRegexp('LogArchiveBucket.*'),
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

  describe('StepFunctions Testing', () => {
    it('Should have Stepfunctions(StateMachine) execution role', () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('daily-cw-logs-archive-machine-.*-role'),
        Description: 'daily CloudWatch Logs archive machine role.',
        AssumeRolePolicyDocument: Match.objectEquals({
          Version: '2012-10-17',
          Statement: Match.arrayEquals([
            Match.objectEquals({
              Effect: 'Allow',
              Principal: {
                Service: 'states.us-east-1.amazonaws.com',
              },
              Action: 'sts:AssumeRole',
            }),
          ]),
        }),
      }));
    });
    it('Should have StepFunctions(StateMachine) default policy', () => {
      template.hasResourceProperties('AWS::IAM::Policy', Match.objectEquals({
        PolicyName: Match.stringLikeRegexp('daily-cw-logs-archive-machine-.*-default-policy'),
        Roles: Match.arrayEquals([
          {
            Ref: Match.stringLikeRegexp('StateMachineRole.*'),
          },
        ]),
        PolicyDocument: Match.objectEquals({
          Statement: Match.arrayEquals([
            {
              Action: 'tag:GetResources',
              Effect: 'Allow',
              Resource: '*',
            },
            {
              Action: 'lambda:InvokeFunction',
              Effect: 'Allow',
              Resource: Match.arrayEquals([
                {
                  'Fn::GetAtt': Match.arrayEquals([
                    Match.stringLikeRegexp('LogArchiveFunction.*'),
                    'Arn',
                  ]),
                },
                {
                  'Fn::Join': Match.arrayEquals([
                    '',
                    [
                      {
                        'Fn::GetAtt': Match.arrayEquals([
                          Match.stringLikeRegexp('LogArchiveFunction.*'),
                          'Arn',
                        ]),
                      },
                      ':*',
                    ],
                  ]),
                },
              ]),
            },
            {
              Action: 'logs:DescribeExportTasks',
              Effect: 'Allow',
              Resource: '*',
            },
          ]),
          Version: '2012-10-17',
        }),
      }));
    });
    it('Should have StateMachine', () => {
      template.hasResourceProperties('AWS::StepFunctions::StateMachine', Match.objectEquals({
        StateMachineName: Match.stringLikeRegexp('daily-cw-logs-archive-.*-machine'),
        DefinitionString: Match.anyValue(),
        RoleArn: Match.objectEquals({
          'Fn::GetAtt': Match.arrayEquals([
            Match.stringLikeRegexp('StateMachineRole.*'),
            'Arn',
          ]),
        }),
      }));
    });
  });

  describe('Lambda Testing', () => {

    it('Should have lambda execution role', () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('daily-cw-logs-archive-lambda-exec-.*-role'),
        Description: Match.anyValue(),
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
                      Match.stringLikeRegexp('LogArchiveBucket.*'),
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
        FunctionName: Match.stringLikeRegexp('daily-cw-logs-archive-.*-func'),
        Handler: 'index.handler',
        Runtime: 'nodejs20.x',
        Code: {
          S3Bucket: Match.anyValue(),
          S3Key: Match.stringLikeRegexp('.*.zip'),
        },
        Description: Match.anyValue(),
        Environment: {
          Variables: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            BUCKET_NAME: {
              Ref: Match.stringLikeRegexp('LogArchiveBucket.*'),
            },
          },
        },
        Role: {
          'Fn::GetAtt': [
            Match.stringLikeRegexp('LambdaExecutionRole.*'),
            'Arn',
          ],
        },
      }));
    });
  });

  describe('Schedule Testing', () => {
    it('Should have Schedule policy', () => {
      template.hasResourceProperties('AWS::IAM::Role', Match.objectEquals({
        RoleName: Match.stringLikeRegexp('daily-cw-logs-archive-.*-schedule-role'),
        Description: Match.anyValue(),
        AssumeRolePolicyDocument: Match.objectEquals({
          Version: '2012-10-17',
          Statement: Match.arrayEquals([
            {
              Action: 'sts:AssumeRole',
              Effect: 'Allow',
              Principal: {
                Service: 'scheduler.amazonaws.com',
              },
            },
          ]),
        }),
        Policies: Match.arrayEquals([
          {
            PolicyName: Match.stringLikeRegexp('state-machine-exec-policy'),
            PolicyDocument: Match.objectEquals({
              Version: '2012-10-17',
              Statement: Match.arrayEquals([
                {
                  Action: 'states:StartExecution',
                  Effect: 'Allow',
                  Resource: {
                    Ref: Match.stringLikeRegexp('StateMachine.*'),
                  },
                },
              ]),
            }),
          },
        ]),
      }));
    });

    it('Should have Schedule', () => {
      template.hasResourceProperties('AWS::Scheduler::Schedule', Match.objectEquals({
        Name: Match.stringLikeRegexp('daily-cw-logs-archive-.*-schedule'),
        Description: Match.anyValue(),
        State: 'ENABLED',
        FlexibleTimeWindow: {
          Mode: 'OFF',
        },
        ScheduleExpressionTimezone: 'UTC',
        ScheduleExpression: Match.stringLikeRegexp('cron(.* 13 * * ? *)'),
        Target: Match.objectEquals({
          Arn: {
            Ref: Match.stringLikeRegexp('StateMachine.*'),
          },
          RoleArn: {
            'Fn::GetAtt': [
              Match.stringLikeRegexp('SchedulerExecutionRole.*'),
              'Arn',
            ],
          },
          Input: Match.anyValue(),
          RetryPolicy: {
            MaximumEventAgeInSeconds: 60,
            MaximumRetryAttempts: 0,
          },
        }),
      }));
      template.resourceCountIs('AWS::Scheduler::Schedule', 1);
    });
  });

  describe('Snapshot Testing', () => {
    it('Should match snapshot', () => {
      expect(template.toJSON()).toMatchSnapshot('archiver');
    });
  });
});
