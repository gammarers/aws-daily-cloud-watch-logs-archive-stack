import * as crypto from 'crypto';
import { SecureBucketEncryption } from '@gammarer/aws-secure-bucket';
import { SecureLogBucket } from '@gammarer/aws-secure-log-bucket';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as scheduler from 'aws-cdk-lib/aws-scheduler';
import * as sfn from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';
import { Construct } from 'constructs';
import { LogArchiverFunction } from './funcs/log-archiver-function';

export interface DailyCloudWatchLogsArchiveStackProps extends cdk.StackProps {
  readonly targetResourceTag: TargetResourceTagProperty;
}

export interface TargetResourceTagProperty {
  readonly key: string;
  readonly values: string[];
}

export class DailyCloudWatchLogsArchiveStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: DailyCloudWatchLogsArchiveStackProps) {
    super(scope, id, props);

    // 👇 Get current account & region
    //const account = cdk.Stack.of(this).account;
    //const stackName: string = cdk.Stack.of(this).stackName;
    //const region = cdk.Stack.of(this).region;
    //const account = this.account;
    const region = this.region;

    const randomNameKey = crypto.createHash('shake256', { outputLength: 4 })
      .update(cdk.Names.uniqueId(this))
      .digest('hex');


    // 👇 Create Backup S3 Bucket
    const logArchiveBucket = new SecureLogBucket(this, 'LogArchiveBucket', {
      bucketName: `log-archive-${randomNameKey}`,
      encryption: SecureBucketEncryption.S3_MANAGED,
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

    // 👇 Create Lambda Execution role.
    const lambdaExecutionRole = new iam.Role(this, 'LambdaExecutionRole', {
      roleName: `daily-cw-logs-archive-lambda-exec-${randomNameKey}-role`,
      description: 'daily CloudWatch Logs archive machine exec role.',
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

    // 👇 Create Lambda Function
    const lambdaFunction = new LogArchiverFunction(this, 'LogArchiveFunction', {
      functionName: `daily-cw-logs-archive-${randomNameKey}-func`,
      description: 'A function to archive logs s3 bucket from CloudWatch Logs.',
      environment: {
        BUCKET_NAME: logArchiveBucket.bucketName,
      },
      role: lambdaExecutionRole,
    });

    // 👇 Create Lambda Function Log Group
    new logs.LogGroup(this, 'LambdaFunctionLogGroup', {
      // logGroupName: lambdaFunction.logGroup.logGroupName, // <- If you specify this line to Custom:LogRotation resource created.
      logGroupName: `/aws/lambda/${lambdaFunction.functionName}`,
      retention: logs.RetentionDays.ONE_MONTH,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const succeed = new sfn.Succeed(this, 'Succeed');

    // 👇 Get CloudWatch Logs Resources
    const getLogGroupResources = new tasks.CallAwsService(this, 'GetResources', {
      iamResources: ['*'],
      iamAction: 'tag:GetResources',
      service: 'resourcegroupstaggingapi',
      action: 'getResources',
      parameters: {
        ResourceTypeFilters: [
          'logs:log-group',
        ],
        TagFilters: [
          {
            'Key.$': '$.tagKey',
            'Values.$': '$.tagValues',
          },
        ],
      },
      resultPath: '$.Result',
      resultSelector: {
        'TargetResources.$': '$..ResourceTagMappingList[*].ResourceARN',
      },
    });

    // Log Group Export Map
    const logGroupExportMap = new sfn.Map(this, 'LogGroupExportMap', {
      itemsPath: sfn.JsonPath.stringAt('$.Result.TargetResources'),
      maxConcurrency: 1,
    });

    // 👇 Get Log Group Name
    const getLogGroupName = new sfn.Pass(this, 'GetLogGroupName', {
      parameters: {
        'TargetLogGroupName.$': "States.ArrayGetItem(States.StringSplit($, ':'), 6)",
      },
    });

    logGroupExportMap.iterator(getLogGroupName);

    // 👇 Invoke Lambda Function
    const invokeLambdaFunction = new tasks.LambdaInvoke(this, 'InvokeLambdaFunction', {
      lambdaFunction: lambdaFunction,
      outputPath: '$.Payload',
      payload: sfn.TaskInput.fromJsonPathAt('$'),
      retryOnServiceExceptions: true,
    });

    getLogGroupName.next(invokeLambdaFunction);

    // 👇 Describe Export Tasks
    const describeExportTasks = new tasks.CallAwsService(this, 'DescribeExportTasks', {
      iamResources: ['*'],
      iamAction: 'logs:DescribeExportTasks',
      service: 'cloudwatchlogs',
      action: 'describeExportTasks',
      parameters: {
        'TaskId.$': '$.TaskId',
      },
      resultPath: '$.Result',
      resultSelector: {
        'DescribeExportTasksStatus.$': '$.ExportTasks[0].Status.Code',
      },
    });

    invokeLambdaFunction.next(describeExportTasks);

    const exportRunningWait = new sfn.Wait(this, 'ExportRunningWait', {
      time: sfn.WaitTime.duration(Duration.seconds(10)),
    });

    const exportPendingWait = new sfn.Wait(this, 'ExportPendingWait', {
      time: sfn.WaitTime.duration(Duration.seconds(3)),
    });

    // 👇 Export Status Check
    const exportTaskStatusCheck = new sfn.Choice(this, 'ExportTaskStatusCheck')
      .when(
        sfn.Condition.stringEquals('$.Result.DescribeExportTasksStatus', 'FAILED'),
        getLogGroupName,
      )
      .when(
        sfn.Condition.stringEquals('$.Result.DescribeExportTasksStatus', 'RUNNING'),
        exportRunningWait
          .next(describeExportTasks),
      )
      .when(
        sfn.Condition.stringEquals('$.Result.DescribeExportTasksStatus', 'PENDING'),
        exportPendingWait
          .next(describeExportTasks),
      )
      .otherwise(succeed);

    describeExportTasks.next(exportTaskStatusCheck);

    getLogGroupResources.next(logGroupExportMap);

    //
    const machine = new sfn.StateMachine(this, 'StateMachine', {
      stateMachineName: `daily-cw-logs-archive-${randomNameKey}-machine`,
      definition: getLogGroupResources,
    });
    // 👇 auto generated role name & description renaming.
    const role = machine.node.findChild('Role') as iam.Role;
    const cfnRole = role.node.defaultChild as iam.CfnRole;
    cfnRole.addPropertyOverride('RoleName', `daily-cw-logs-archive-machine-${randomNameKey}-role`);
    cfnRole.addPropertyOverride('Description', 'daily CloudWatch Logs archive machine role.');
    const policy = role.node.findChild('DefaultPolicy') as iam.Policy;
    const cfnPolicy = policy.node.defaultChild as iam.CfnPolicy;
    cfnPolicy.addPropertyOverride('PolicyName', `daily-cw-logs-archive-machine-${randomNameKey}-default-policy`);

    // 👇 EventBridge Scheduler IAM Role (StateMachine Start Execution)
    const schedulerExecutionRole = new iam.Role(this, 'SchedulerExecutionRole', {
      roleName: `daily-cw-logs-archive-${randomNameKey}-schedule-role`,
      description: 'daily CloudWatch Log archive schedule',
      assumedBy: new iam.ServicePrincipal('scheduler.amazonaws.com'),
      inlinePolicies: {
        'state-machine-exec-policy': new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                'states:StartExecution',
              ],
              resources: [
                machine.stateMachineArn,
              ],
            }),
          ],
        }),
      },
    });

    // 👇 Schedule
    new scheduler.CfnSchedule(this, 'Schedule', {
      name: `daily-cw-logs-archive-${randomNameKey}-schedule`,
      description: 'daily CloudWatch Logs archive schedule',
      state: 'ENABLED',
      flexibleTimeWindow: {
        mode: 'OFF',
      },
      scheduleExpressionTimezone: 'UTC',
      scheduleExpression: 'cron(1 13 * * ? *)',
      target: {
        arn: machine.stateMachineArn,
        roleArn: schedulerExecutionRole.roleArn,
        input: JSON.stringify({
          tagKey: props.targetResourceTag.key,
          tagValues: props.targetResourceTag.values,
        }),
        retryPolicy: {
          maximumEventAgeInSeconds: 60,
          maximumRetryAttempts: 0,
        },
      },
    });
  }
}