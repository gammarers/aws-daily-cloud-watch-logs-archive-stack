# Daily CloudWatch Log Archiver

AWS CloudWatch Logs daily(13:00Z) archive to s3 bucket.

## Resources

This construct creating resource list.

- S3 Bucket (log-archive-xxxxxxxx from @yicr/secure-log-bucket)
- Lambda function execution role
- Lambda function
- EventBridge Scheduler execution role
- EventBridge Scheduler Group
- EventBridge Scheduler (this construct props specified count)

## Install

### TypeScript

```shell
npm install @yicr/daily-cloud-watch-log-archiver
```
or
```shell
yarn add @yicr/daily-cloud-watch-log-archiver
```

## Example

```shell
npm install @yicr/daily-cloud-watch-log-archiver
```

```typescript
import { DailyCloudWatchLogArchiver } from '@yicr/daily-cloud-watch-log-archiver';

new DailyCloudWatchLogArchiver(stack, 'DailyCloudWatchLogArchiver', {
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
