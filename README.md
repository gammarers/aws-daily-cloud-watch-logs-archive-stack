# AWS Daily CloudWatch Logs Archive Stack

[![GitHub](https://img.shields.io/github/license/gammarers/aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://github.com/gammarers/aws-daily-cloud-watch-logs-archive-stack/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarers/aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://www.npmjs.com/package/@gammarers/aws-daily-cloud-watch-logs-archive-stack)
[![PyPI](https://img.shields.io/pypi/v/gammarers.aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://pypi.org/project/gammarers.aws-daily-cloud-watch-logs-archive-stack/)
[![Nuget](https://img.shields.io/nuget/v/gammarers.CDK.AWS.DailyCloudWatchLogsArchiveStack?style=flat-square)](https://www.nuget.org/packages/gammarers.CDK.AWS.DailyCloudWatchLogsArchiveStack/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarers/aws-daily-cloud-watch-logs-archive-stack/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarers/aws-daily-cloud-watch-logs-archive-stack/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarers/aws-daily-cloud-watch-logs-archive-stack?sort=semver&style=flat-square)](https://github.com/gammarers/aws-daily-cloud-watch-logs-archive-stack/releases)

[![View on Construct Hub](https://constructs.dev/badge?package=@gammarers/aws-daily-cloud-watch-logs-archive-stack)](https://constructs.dev/packages/@gammarers/aws-daily-cloud-watch-logs-archive-stack)

AWS CloudWatch Logs daily(13:00Z) archive to s3 bucket.

## Resources

This construct creating resource list.

- S3 Bucket (log-archive-xxxxxxxx from @gammarers/aws-secure-log-bucket)
- Lambda function execution role
- Lambda function
- Lambda function log group
- StepFunctions state machine execution role
- StepFunctions state machine
- EventBridge Scheduler execution role
- EventBridge Scheduler

## Architecture

![architecture](/architecture.drawio.svg)

## Install

### TypeScript

```shell
npm install @gammarers/aws-daily-cloud-watch-logs-archive-stack
# or
yarn add @gammarers/aws-daily-cloud-watch-logs-archive-stack
```

### Python

```shell
pip install gammarers.aws-daily-cloud-watch-logs-archive-stack
```

### C# / .NET

```shell
dotnet add package Gammarers.CDK.AWS.DailyCloudWatchLogsArchiveStack
```

## Example

```shell
npm install @gammarers/aws-daily-cloud-watch-logs-archive-stack
```

```typescript
import { DailyCloudWatchLogsArchiveStack } from '@gammarers/aws-daily-cloud-watch-logs-archive-stack';

new DailyCloudWatchLogsArchiveStack(stack, 'DailyCloudWatchLogsArchiveStack', {
    targetResourceTag: {
      key: 'DailyLogExport',
      values: ['Yes'],
    },
});

```

## Otherwise

If you want to export old log files, please refer to the following repository. The log file will be exported in the same output format.

[AWS CloudWatch Logs Exporter](https://github.com/gammarers/aws-cloud-watch-logs-exporter)

## License

This project is licensed under the Apache-2.0 License.
