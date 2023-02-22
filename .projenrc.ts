import { awscdk } from 'projen';
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'yicr',
  authorAddress: 'yicr@users.noreply.github.com',
  cdkVersion: '2.66.0',
  defaultReleaseBranch: 'main',
  name: '@yicr/daily-cloud-watch-log-rotation',
  projenrcTs: true,
  repositoryUrl: 'https://github.com/yicr/daily-cloud-watch-log-rotation.git',
  description: undefined,
  devDeps: [
    '@yicr/secure-bucket',
  ],
  peerDeps: [
    '@yicr/secure-bucket',
  ],
});
project.synth();