import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.189.1',
  typescriptVersion: '5.7.x',
  jsiiVersion: '5.7.x',
  defaultReleaseBranch: 'main',
  name: '@gammarers/aws-daily-cloud-watch-logs-archive-stack',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/gammarers/aws-daily-cloud-watch-logs-archive-stack.git',
  description: 'AWS CloudWatch Logs daily archive to s3 bucket',
  keywords: ['aws', 'cdk', 'aws-cdk', 'scheduler', 's3', 'bucket', 'archive', 'lambda'],
  majorVersion: 2,
  deps: [
    '@gammarers/aws-secure-log-bucket@~2.0.7',
    '@gammarers/aws-secure-bucket@~2.0.8',
  ],
  devDeps: [
    'aws-sdk-client-mock@^3',
    'aws-sdk-client-mock-jest@^3',
    '@aws-sdk/client-cloudwatch-logs',
    '@types/aws-lambda',
    '@gammarers/jest-aws-cdk-asset-filename-renamer@~0.5.8',
  ],
  peerDeps: [
    '@gammarers/aws-secure-log-bucket@~2.0.7',
    '@gammarers/aws-secure-bucket@~2.0.8',
  ],
  compat: true,
  jestOptions: {
    jestConfig: {
      snapshotSerializers: ['<rootDir>/node_modules/@gammarers/jest-aws-cdk-asset-filename-renamer'],
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
  workflowNodeVersion: '22.4.x',
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