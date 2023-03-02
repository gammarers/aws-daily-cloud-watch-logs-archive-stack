import { CloudWatchLogsClient, CreateExportTaskCommand } from '@aws-sdk/client-cloudwatch-logs';
import { Context } from 'aws-lambda';
import { mockClient } from 'aws-sdk-client-mock';
import { EnvironmentVariableError, EventInput, handler, InputVariableError } from '../src/log-archiver.lambda';

describe('Lambda Function Handler testing', () => {

  const cwLogsMock = mockClient(CloudWatchLogsClient);

  beforeEach(() => {
    cwLogsMock.reset();
  });

  it('Should CloudWatch Logs CreateExportTask for scheduled event', async () => {

    cwLogsMock
      .on(CreateExportTaskCommand)
      .resolves({
        $metadata: {
          httpStatusCode: 200,
        },
        taskId: 'cda45419-90ea-4db5-9833-aade86253e66',
      });

    const payload: EventInput = {
      destinationPrefix: 'example-logs',
      logGroupName: 'example-log-group',
    };

    process.env = {
      BucketName: 'example-log-archive-bucket',
    };
    const result = await handler(payload, {} as Context);

    expect(result).toHaveLength(36);
    expect(result).toBe('cda45419-90ea-4db5-9833-aade86253e66');

    //expect(cwLogsMock).toHaveReceivedCommandTimes(CreateExportTaskCommand,1);
  });

  it('Should EnvironmentVariableError(BucketName)', async () => {
    const payload: EventInput = {
      destinationPrefix: 'example-logs',
      logGroupName: 'example-log-group',
    };
    process.env = {};
    //const result = handler(payload, {} as Context);
    await expect(handler(payload, {} as Context)).rejects.toThrow(EnvironmentVariableError);
    //expect(result).toThrowError(EnvironmentVariableError);
  });

  it('Should have occurrence error to InputVariableError(event.logGroupName)', async () => {
    const payload: EventInput = {
      destinationPrefix: 'example-logs',
    };
    process.env = {
      BucketName: 'example-log-archive-bucket',
    };
    await expect(handler(payload, {} as Context)).rejects.toThrow(InputVariableError);
  });

  it('Should have occurrence error to InputVariableError(event.destinationPrefix)', async () => {
    const payload: EventInput = {
      logGroupName: 'example-log-group',
    };
    process.env = {
      BucketName: 'example-log-archive-bucket',
    };
    await expect(handler(payload, {} as Context)).rejects.toThrow(InputVariableError);
  });
});