import { AvailableMailers } from '../../src/modules';
import { AzureMailerService } from '../../src/modules/mailing/infrastructure';
import { KnownEmailSendStatus } from '@azure/communication-email';
import { Logger } from '@nestjs/common';
import { PollerNotStartedException } from '../../src/modules/mailing/infrastructure/exception';
import { catcher } from '../../src/common/util/catcher';

describe('AzureMailerService', () => {
  const logger = {
    error: jest.fn(),
    debug: jest.fn(),
  };
  const emailClient = {
    beginSend: jest.fn(),
  };

  const azureMailerService = new AzureMailerService(
    {
      connectionString: 'lala',
      defaultFromEmail: 'test@test.com',
      type: AvailableMailers.AZURE,
      clientOptions: {},
    },
    emailClient as any,
    logger as unknown as Logger,
  );

  it('should be defined smoke test', () => {
    expect(azureMailerService).toBeDefined();
  });

  describe('sendEmail', () => {
    describe('given issues with starting the poller', () => {
      it('should log & throw the error', async () => {
        emailClient.beginSend.mockRejectedValueOnce(new Error('Not beep boop'));

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        const expectedError = new Error('Not beep boop');

        expect(res[1]).toEqual(expectedError);
        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe('given poller has not started', () => {
      it('should throw PollerNotStartedException', async () => {
        emailClient.beginSend.mockResolvedValueOnce({
          getOperationState: () => ({
            isStarted: false,
            error: new Error(''),
            isCancelled: true,
            isCompleted: true,
            result: { id: '1', status: KnownEmailSendStatus.Failed },
          }),
        });

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        const expectedError = new PollerNotStartedException();

        expect(res[1]).toEqual(expectedError);
      });
    });

    describe('given invalid result', () => {
      it('should log & throw error', async () => {
        const expectedError = new Error('Something is not yes');

        emailClient.beginSend.mockResolvedValueOnce({
          getOperationState: () => ({
            isStarted: true,
            error: new Error(''),
            isCancelled: true,
            isCompleted: true,
            result: { id: '1', status: KnownEmailSendStatus.Failed, error: expectedError },
          }),
          isDone: () => true,
          getResult: () => ({ id: '1', status: KnownEmailSendStatus.Failed, error: expectedError }),
        });

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        expect(res[1]).toEqual(expectedError);
        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe('given everything went smoothly', () => {
      it('should log results with debug', async () => {
        emailClient.beginSend.mockResolvedValueOnce({
          getOperationState: () => ({
            isStarted: true,
            error: new Error(''),
            isCancelled: true,
            isCompleted: true,
            result: { id: '1', status: KnownEmailSendStatus.Failed },
          }),
          isDone: () => true,
          getResult: () => ({
            id: '1',
            status: KnownEmailSendStatus.Succeeded,
          }),
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        expect(res[1]).toBeNull();
        expect(res[0]).toBeUndefined();

        expect(logger.debug).toHaveBeenCalledWith(`Successfully sent the email (operation id: 1)`);
      });
    });
  });
});
