# AWS Daily CloudWatch Logs Archiver

AWS CloudWatch Logs daily(13:00Z) archive to s3 bucket.

## Resources

This construct creating resource list.

- S3 Bucket (log-archive-xxxxxxxx from @yicr/aws-secure-log-bucket)
- Lambda function execution role
- Lambda function
- EventBridge Scheduler execution role
- EventBridge Scheduler Group
- EventBridge Scheduler (this construct props specified count)

## Install

### TypeScript

```shell
npm install @gammarer/aws-daily-cloud-watch-logs-archiver
# or
yarn add @gammarer/aws-daily-cloud-watch-logs-archiver
```

### Python

```shell
pip install gammarer.aws-daily-cloud-watch-logs-archiver
```

## Example

```shell
npm install @gammarer/aws-daily-cloud-watch-logs-archiver
```

```typescript
import { DailyCloudWatchLogsArchiver } from '@gammarer/aws-daily-cloud-watch-logs-archiver';

new DailyCloudWatchLogsArchiver(stack, 'DailyCloudWatchLogsArchiver', {
  schedules: [
    {
      name: 'example-log-archive-1st-rule',
      description: 'example log archive 1st rule.',
      target: {
        logGroupName: 'example-log-1st-group', // always created CloudWatch Log group
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

```

## License

This project is licensed under the Apache-2.0 License.
