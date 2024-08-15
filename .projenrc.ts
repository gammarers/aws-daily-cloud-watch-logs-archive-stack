import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.80.0',
  constructsVersion: '10.0.5',
  typescriptVersion: '5.4.x',
  jsiiVersion: '5.4.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-daily-cloud-watch-logs-archive-stack',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-daily-cloud-watch-logs-archive-stack.git',
  description: 'AWS CloudWatch Logs daily archive to s3 bucket',
  keywords: ['aws', 'cdk', 'aws-cdk', 'scheduler', 's3', 'bucket', 'archive', 'lambda'],
  majorVersion: 2,
  deps: [
    '@gammarers/aws-secure-log-bucket@~1.6.2',
    '@gammarers/aws-secure-bucket@~1.3.3',
  ],
  devDeps: [
    'aws-sdk-client-mock@^3',
    'aws-sdk-client-mock-jest@^3',
    '@aws-sdk/client-cloudwatch-logs',
    '@types/aws-lambda',
    '@gammarer/jest-serializer-aws-cdk-asset-filename-replacer',
  ],
  peerDeps: [
    '@gammarers/aws-secure-log-bucket@~1.6.2',
    '@gammarers/aws-secure-bucket@~1.3.3',
  ],
  compat: true,
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarer/jest-serializer-aws-cdk-asset-filename-replacer'],
    },
    extraCliOptions: ['--silent'],
  },
  tsconfigDev: {
    compilerOptions: {
      strict: true,
    },
  },
  lambdaOptions: {
    // target node.js runtime
    runtime: awscdk.LambdaRuntime.NODEJS_20_X,
    bundlingOptions: {
      // list of node modules to exclude from the bundle
      externals: ['@aws-sdk/client-cloudwatch-logs'],
      sourcemap: true,
    },
  },
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '18.0.0',
  workflowNodeVersion: '20.11.0',
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ['auto-approve', 'auto-merge'],
      schedule: javascript.UpgradeDependenciesSchedule.expressions(['0 19 * * 3']), // every wednesday 19:00 (JST/THU:0400)
    },
  },
  autoApproveOptions: {
    secret: 'GITHUB_TOKEN',
    allowedUsernames: ['yicr'],
  },
  publishToPypi: {
    distName: 'gammarers.aws-daily-cloud-watch-logs-archive-stack',
    module: 'gammarers.aws_daily_cloud_watch_logs_archive_stack',
  },
  publishToNuget: {
    dotNetNamespace: 'Gammarers.CDK.AWS',
    packageId: 'Gammarers.CDK.AWS.DailyCloudWatchLogsArchiveStack',
  },
});
project.synth();