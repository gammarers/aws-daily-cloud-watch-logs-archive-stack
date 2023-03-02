import * as crypto from 'crypto';
import { SecureBucket, SecureBucketEncryption } from '@yicr/secure-bucket';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
//import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import { Construct } from 'constructs';
import { LogArchiverFunction } from './log-archiver-function';

// export interface DailyCloudWatchLogArchiverProps {
// }

export class DailyCloudWatchLogArchiver extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

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
    // const lambdaFunction =
    new LogArchiverFunction(this, 'LogArchiveFunction', {
      functionName: `daily-cw-log-archiver-${randomNameKey}-func`,
      description: 'A function to archive logs s3 bucket from CloudWatch Logs.',
      environment: {
        BUCKET_NAME: logArchiveBucket.bucketName,
      },
      role: lambdaExecutionRole,
    });

    // 👇Schedule
    // new scheduler.CfnSchedule(this, 'Schedule', {
    //   name: '',
    //   description: '',
    //   endDate: '',
    //   flexibleTimeWindow: undefined,
    //   groupName: '',
    //   kmsKeyArn: '',
    //   scheduleExpression: '',
    //   scheduleExpressionTimezone: '',
    //   startDate: '',
    //   state: '',
    //   target: undefined,
    // });
  }
}