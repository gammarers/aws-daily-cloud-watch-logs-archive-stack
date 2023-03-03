import * as crypto from 'crypto';
import { SecureBucket, SecureBucketEncryption } from '@yicr/secure-bucket';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { LogArchiverFunction } from './log-archiver-function';

export interface DailyCloudWatchLogArchiverProps {
  readonly schedules: ScheduleProperty[];
}

export interface ScheduleProperty {
  readonly name: string;
  readonly description: string;
  readonly target: ScheduleTargetProperty;
}

export interface ScheduleTargetProperty {
  readonly logGroupName: string;
  readonly destinationPrefix: string;
}

export class DailyCloudWatchLogArchiver extends Construct {
  constructor(scope: Construct, id: string, props: DailyCloudWatchLogArchiverProps) {
    super(scope, id);

    // props validation
    if (props.schedules.length === 0) {
      throw new Error('Schedule not set.');
    }
    if (props.schedules.length >= 50) {
      throw new Error('Maximum number(60) of schedule.');
    }

    // 👇Get current account & region
    // const account = cdk.Stack.of(this).account;
    const region = cdk.Stack.of(this).region;

    const randomNameKey = crypto.createHash('shake256', { outputLength: 4 })
      .update(cdk.Names.uniqueId(this))
      .digest('hex');

    // 👇Create Backup S3 Bucket
    const logArchiveBucket = new SecureBucket(this, 'LogArchiveBucket', {
      bucketName: `log-archive-${randomNameKey}`,
      encryption: SecureBucketEncryption.KMS_MANAGED,
    });
    logArchiveBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal(`logs.${region}.amazonaws.com`),
      ],
      actions: [
        's3:GetBucketAcl',
      ],
      resources: [
        logArchiveBucket.bucketArn,
      ],
    }));
    logArchiveBucket.addToResourcePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      principals: [
        new iam.ServicePrincipal(`logs.${region}.amazonaws.com`),
      ],
      actions: [
        's3:PutObject',
      ],
      resources: [
        `${logArchiveBucket.bucketArn}/*`,
      ],
      conditions: {
        StringEquals: {
          's3:x-amz-acl': 'bucket-owner-full-control',
        },
      },
    }));

    // 👇Create Lambda Execution role.
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: `daily-cw-log-archiver-lambda-exec-${randomNameKey}-role`,
      description: '',
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'),
      ],
      inlinePolicies: {
        ['log-export-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'logs:CreateExportTask',
              ],
              resources: ['*'],
            }),
          ],
        }),
        ['put-bucket-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                's3:GetBucketAcl',
                's3:PutObject',
              ],
              resources: [
                logArchiveBucket.bucketArn,
              ],
            }),
          ],
        }),
      },
    });

    // 👇Create Lambda Function
    const lambdaFunction = new LogArchiverFunction(this, 'LogArchiveFunction', {
      functionName: `daily-cw-log-archiver-${randomNameKey}-func`,
      description: 'A function to archive logs s3 bucket from CloudWatch Logs.',
      environment: {
        BUCKET_NAME: logArchiveBucket.bucketName,
      },
      role: lambdaExecutionRole,
    });

    // 👇EventBridge Scheduler IAM Role
    const schedulerExecutionRole = new iam.Role(this, 'SchedulerExecutionRole', {
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        ['lambda-invoke-policy']: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'lambda:InvokeFunction',
              ],
              resources: [
                lambdaFunction.functionArn,
                `${lambdaFunction.functionArn}:*`,
              ],
            }),
          ],
        }),
      },
    });

    // 👇Create Schedule Group
    const scheduleGroup = new scheduler.CfnScheduleGroup(this, 'ScheduleGroup', {
      name: `log-archive-schedule-${randomNameKey}-group`,
    });

    for (const [index, schedule] of Object.entries(props.schedules)) {
      // 👇Schedule ID prefix
      const idPrefix = crypto.createHash('shake256', { outputLength: 4 })
        .update(schedule.name)
        .digest('hex');

      // 👇Schedule
      new scheduler.CfnSchedule(this, `Schedule${idPrefix}`, {
        name: schedule.name,
        description: schedule.description,
        state: 'ENABLED',
        groupName: scheduleGroup.name,
        flexibleTimeWindow: {
          mode: 'OFF',
        },
        scheduleExpressionTimezone: 'UTC',
        scheduleExpression: `cron(${index} 13 * * ? *)`, // max 60
        target: {
          arn: lambdaFunction.functionArn,
          roleArn: schedulerExecutionRole.roleArn,
          input: JSON.stringify({
            logGroupName: schedule.target.logGroupName,
            destinationPrefix: schedule.target.destinationPrefix,
          }),
          retryPolicy: {
            maximumEventAgeInSeconds: 60,
            maximumRetryAttempts: 0,
          },
        },
      });
    }
  }
}