[![GitHub](https://img.shields.io/github/license/yicr/aws-daily-cloud-watch-logs-archiver?style=flat-square)](https://github.com/yicr/aws-daily-cloud-watch-logs-archiver/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarer/aws-daily-cloud-watch-logs-archiver?style=flat-square)](https://www.npmjs.com/package/@gammarer/aws-daily-cloud-watch-logs-archiver)
[![PyPI](https://img.shields.io/pypi/v/gammarer.aws-daily-cloud-watch-logs-archiver?style=flat-square)](https://pypi.org/project/gammarer.aws-daily-cloud-watch-logs-archiver/)
<!-- [![Nuget](https://img.shields.io/nuget/v/Gammarer.CDK.AWS.DailyCloudWatchLogsArchiver?style=flat-square)](https://www.nuget.org/packages/Gammarer.CDK.AWS.DailyCloudWatchLogsArchiver/)  -->
<!-- [![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.gammarer/aws-daily-cloud-watch-logs-archiver?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/gammarer/aws-daily-cloud-watch-logs-archiver/) -->
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/yicr/aws-daily-cloud-watch-logs-archiver/release.yml?branch=main&label=release&style=flat-square)](https://github.com/yicr/aws-daily-cloud-watch-logs-archiver/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/yicr/aws-daily-cloud-watch-logs-archiver?sort=semver&style=flat-square)](https://github.com/yicr/aws-daily-cloud-watch-logs-archiver/releases)

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
