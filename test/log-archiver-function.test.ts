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
    };

    process.env = {
      BucketName: 'example-log-archive-bucket',
      LogGroupName: 'log-archiver-exec-log',
    };
    const result = await handler(payload, {} as Context);

    expect(result).toHaveLength(36);
    expect(result).toBe('cda45419-90ea-4db5-9833-aade86253e66');

    //expect(cwLogsMock).toHaveReceivedCommandTimes(CreateExportTaskCommand,1);
  });

  it('Should EnvironmentVariableError(BucketName)', async () => {
    const payload: EventInput = {
      destinationPrefix: 'example-logs',
    };
    process.env = {
      LogGroupName: 'log-archiver-exec-log',
    };
    //const result = handler(payload, {} as Context);
    await expect(handler(payload, {} as Context)).rejects.toThrow(EnvironmentVariableError);
    //expect(result).toThrowError(EnvironmentVariableError);
  });

  it('Should EnvironmentVariableError(LogGroupName)', async () => {
    const payload: EventInput = {
      destinationPrefix: 'example-logs',
    };
    process.env = {
      BucketName: 'example-log-archive-bucket',
    };

    //const result = handler(payload, {} as Context);

    await expect(handler(payload, {} as Context)).rejects.toThrow(EnvironmentVariableError);
    //expect(result).toThrow(EnvironmentVariableError);
  });

  it('Should InputVariableError(event.destination.prefix)', async () => {
    const payload: EventInput = {};
    process.env = {
      BucketName: 'example-log-archive-bucket',
      LogGroupName: 'log-archiver-exec-log',
    };
    //const result = handler(payload, {} as Context);

    await expect(handler(payload, {} as Context)).rejects.toThrow(InputVariableError);
    //expect(result).toThrowError(InputVariableError);
  });
});