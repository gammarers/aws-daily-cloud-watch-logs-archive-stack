# AWS Daily CloudWatch Logs Archive　Stack

[![GitHub](https://img.shields.io/github/license/gammarer/aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://github.com/gammarer/aws-daily-cloud-watch-logs-archive-stack/blob/main/LICENSE)
[![npm (scoped)](https://img.shields.io/npm/v/@gammarer/aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://www.npmjs.com/package/@gammarer/aws-daily-cloud-watch-logs-archive-stack)
[![PyPI](https://img.shields.io/pypi/v/gammarer.aws-daily-cloud-watch-logs-archive-stack?style=flat-square)](https://pypi.org/project/gammarer.aws-daily-cloud-watch-logs-archive-stack/)
[![Nuget](https://img.shields.io/nuget/v/Gammarer.CDK.AWS.DailyCloudWatchLogsArchiveStack?style=flat-square)](https://www.nuget.org/packages/Gammarer.CDK.AWS.DailyCloudWatchLogsArchiveStack/)
[![Sonatype Nexus (Releases)](https://img.shields.io/nexus/r/com.gammarer/aws-daily-cloud-watch-logs-archive-stack?server=https%3A%2F%2Fs01.oss.sonatype.org%2F&style=flat-square)](https://s01.oss.sonatype.org/content/repositories/releases/com/gammarer/aws-daily-cloud-watch-logs-archive-stack/)
[![GitHub Workflow Status (branch)](https://img.shields.io/github/actions/workflow/status/gammarer/aws-daily-cloud-watch-logs-archive-stack/release.yml?branch=main&label=release&style=flat-square)](https://github.com/gammarer/aws-daily-cloud-watch-logs-archive-stack/actions/workflows/release.yml)
[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/gammarer/aws-daily-cloud-watch-logs-archive-stack?sort=semver&style=flat-square)](https://github.com/gammarer/aws-daily-cloud-watch-logs-archive-stack/releases)

[![View on Construct Hub](https://constructs.dev/badge?package=@gammarer/aws-daily-cloud-watch-logs-archive-stack)](https://constructs.dev/packages/@gammarer/aws-daily-cloud-watch-logs-archive-stack)

AWS CloudWatch Logs daily(13:00Z) archive to s3 bucket.

## Resources

This construct creating resource list.

- S3 Bucket (log-archive-xxxxxxxx from @gammarer/aws-secure-log-bucket)
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
npm install @gammarer/aws-daily-cloud-watch-logs-archive-stack
# or
yarn add @gammarer/aws-daily-cloud-watch-logs-archive-stack
```

### Python

```shell
pip install gammarer.aws-daily-cloud-watch-logs-archive-stack
```

### C# / .NET

```shell
dotnet add package Gammarer.CDK.AWS.DailyCloudWatchLogsArchiveStack
```

### Java

Add the following to pom.xml:

```xml
<dependency>
  <groupId>com.gammarer</groupId>
  <artifactId>aws-daily-cloud-watch-logs-archive-stack</artifactId>
</dependency>
```

## Example

```shell
npm install @gammarer/aws-daily-cloud-watch-logs-archive-stack
```

```typescript
import { DailyCloudWatchLogsArchiveStack } from '@gammarer/aws-daily-cloud-watch-logs-archive-stack';

new DailyCloudWatchLogsArchiveStack(stack, 'DailyCloudWatchLogsArchiveStack', {
    targetResourceTag: {
      key: 'DailyLogExport',
      values: ['Yes'],
    },
});

```

## Otherwise

If you want to export old log files, please refer to the following repository. The log file will be exported in the same output format.

[AWS CloudWatch Logs Exporter](https://github.com/gammarer/aws-cloud-watch-logs-exporter)

## License

This project is licensed under the Apache-2.0 License.
