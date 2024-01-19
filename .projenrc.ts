import { awscdk, javascript } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.80.0',
  typescriptVersion: '5.1.x',
  jsiiVersion: '~5.0.0',
  defaultReleaseBranch: 'main',
  name: '@gammarer/aws-daily-cloud-watch-logs-archiver',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/aws-daily-cloud-watch-logs-archiver.git',
  description: 'AWS CloudWatch Logs daily archive to s3 bucket',
  keywords: ['aws', 'cdk', 'aws-cdk', 'scheduler', 's3', 'bucket', 'archive', 'lambda'],
  deps: [
    '@gammarer/aws-secure-log-bucket@~0.12.6',
    '@gammarer/aws-secure-bucket@~0.12.4',
  ],
  devDeps: [
    'aws-sdk-client-mock@^3',
    'aws-sdk-client-mock-jest@^3',
    '@aws-sdk/client-cloudwatch-logs',
    '@types/aws-lambda',
    '@gammarer/jest-serializer-aws-cdk-asset-filename-replacer',
  ],
  peerDeps: [
    '@gammarer/aws-secure-log-bucket@~0.12.6',
    '@gammarer/aws-secure-bucket@~0.12.4',
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
    runtime: awscdk.LambdaRuntime.NODEJS_18_X,
    bundlingOptions: {
      // list of node modules to exclude from the bundle
      externals: ['@aws-sdk/client-cloudwatch-logs'],
      sourcemap: true,
    },
  },
  releaseToNpm: true,
  npmAccess: javascript.NpmAccess.PUBLIC,
  minNodeVersion: '18.0.0',
  workflowNodeVersion: '18.17.1',
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
    distName: 'gammarer.aws-daily-cloud-watch-logs-archiver',
    module: 'gammarer.aws_daily_cloud_watch_logs_archiver',
  },
});
project.synth();