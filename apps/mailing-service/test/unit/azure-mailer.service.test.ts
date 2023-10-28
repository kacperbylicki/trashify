import { AZURE_MAILER_MODULE_OPTIONS_TOKEN } from '../../src/modules/mailing/configurable-azure-mailer.module';
import { AzureMailerService } from '../../src/modules';
import { EMAILS_FEATURE_FLAG } from '../../src/modules/mailing/symbols';
import { EmailClient, KnownEmailSendStatus } from '@azure/communication-email';
import { Logger } from '@nestjs/common';
import { PollerNotStartedException } from '../../src/modules/mailing/exception';
import { Test } from '@nestjs/testing';
import { catcher } from '../../src/common/util/catcher';
import { createMock } from '@golevelup/ts-jest';

jest.mock('@azure/communication-email');

describe('AzureMailerService', () => {
  let azureMailerService: AzureMailerService;
  let logger: Logger;
  let emailClient: EmailClient;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      providers: [
        AzureMailerService,
        {
          provide: AZURE_MAILER_MODULE_OPTIONS_TOKEN,
          useValue: {
            connectionString: 'lalala',
          },
        },
        {
          provide: EMAILS_FEATURE_FLAG,
          useValue: true,
        },
      ],
    })
      .overrideProvider(Logger)
      .useClass(createMock<Logger>())
      .compile();

    azureMailerService = moduleFixture.get(AzureMailerService);

    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    emailClient = azureMailerService.emailClient;

    //eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    logger = azureMailerService.logger;
  });

  it('should be defined smoke test', () => {
    expect(azureMailerService).toBeDefined();
  });

  describe('sendEmail', () => {
    describe('given issues with starting the poller', () => {
      it('should log & throw the error', async () => {
        // given

        jest.spyOn(emailClient, 'beginSend').mockRejectedValueOnce(new Error('Not beep boop'));

        jest.spyOn(logger, 'error').mockImplementationOnce(() => ({}));

        // when

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        // then

        const expectedError = new Error('Not beep boop');

        expect(res[1]).toEqual(expectedError);
        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe('given poller has not started', () => {
      it('should throw PollerNotStartedException', async () => {
        // given

        jest.spyOn(emailClient, 'beginSend').mockResolvedValueOnce({
          getOperationState: () => ({
            isStarted: false,
            error: new Error(''),
            isCancelled: true,
            isCompleted: true,
            result: { id: '1', status: KnownEmailSendStatus.Failed },
          }),
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        // when

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        // then

        const expectedError = new PollerNotStartedException();

        expect(res[1]).toEqual(expectedError);
      });
    });

    describe('given invalid result', () => {
      it('should log & throw error', async () => {
        // given
        const expectedError = new Error('Something is not yes');

        jest.spyOn(emailClient, 'beginSend').mockResolvedValueOnce({
          getOperationState: () => ({
            isStarted: true,
            error: new Error(''),
            isCancelled: true,
            isCompleted: true,
            result: { id: '1', status: KnownEmailSendStatus.Failed, error: expectedError },
          }),
          isDone: () => true,
          getResult: () => ({ id: '1', status: KnownEmailSendStatus.Failed, error: expectedError }),
          //eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any);

        jest.spyOn(logger, 'error');

        // when

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        // then

        expect(res[1]).toEqual(expectedError);
        expect(logger.error).toHaveBeenCalledWith(expectedError);
      });
    });

    describe('given everything went smoothly', () => {
      it('should log results with debug', async () => {
        // given

        jest.spyOn(emailClient, 'beginSend').mockResolvedValueOnce({
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

        jest.spyOn(logger, 'debug');

        // when

        //eslint-disable-next-line @typescript-eslint/no-explicit-any
        const res = await catcher(() => azureMailerService.sendEmail({} as any));

        // then

        expect(res[1]).toBeNull();
        expect(res[0]).toBeUndefined();

        expect(logger.debug).toHaveBeenCalledWith(`Successfully sent the email (operation id: 1)`);
      });
    });
  });
});
