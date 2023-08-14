import { AccountController, LoginRequestDto, RegisterRequestDto } from '@/modules';
import {
  AccountServiceClient,
  GetAccountResponse,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  RegisterResponse,
} from '@trashify/transport';
import { Observable, of } from 'rxjs';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock as autoMocker } from '@golevelup/ts-jest';

describe('AccountController', () => {
  let controller: AccountController;
  let client: AccountServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AccountController],
    })
      .useMocker(autoMocker)
      .compile();

    controller = module.get<AccountController>(AccountController);
    client = module.get<AccountServiceClient>(AccountServiceClient);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('currentAccount', () => {
    // given
    const accountId = '39b64a86-1364-41dd-aba8-3d376fdafe16';

    it('should return the currently logged-in account', async () => {
      // given
      const mockResponse: Observable<GetAccountResponse> = of({
        status: 200,
        error: [],
        data: {
          uuid: accountId,
          email: 'test@example.com',
          username: 'test',
        },
      });
      jest.spyOn(client, 'getAccount').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.currentAccount(accountId);

      // then
      expect(result).toEqual(mockResponse);
    });
  });

  describe('login', () => {
    // given
    const mockRequest: LoginRequestDto = {
      email: 'test@example.com',
      password: 'password',
    };

    it('should login successfully and return a token', async () => {
      // given
      const mockResponse: Observable<LoginResponse> = of({
        status: 200,
        error: [],
        data: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
        },
      });
      jest.spyOn(client, 'login').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.login(mockRequest);

      // then
      expect(result).toEqual(mockResponse);
    });

    it('should return an error response when invalid login details are provided', async () => {
      // given
      const mockResponse: Observable<LoginResponse> = of({
        status: 401,
        error: ['unauthorized'],
        data: undefined,
      });
      jest.spyOn(client, 'login').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.login(mockRequest);

      // then
      expect(result).toEqual(mockResponse);
    });
  });

  describe('register', () => {
    // given
    const mockRequest: RegisterRequestDto = {
      email: 'test@example.com',
      username: 'test',
      password: 'password',
      confirmPassword: 'password',
    };

    it('should create a new account and return success', async () => {
      // given
      const mockResponse: Observable<RegisterResponse> = of({
        status: 200,
        error: [],
        data: undefined,
      });
      jest.spyOn(client, 'register').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.register(mockRequest);

      // then
      expect(result).toEqual(mockResponse);
    });

    it('should return an error response when invalid registration details are provided', async () => {
      // given
      const mockInvalidConfirmPasswordRequest: RegisterRequestDto = {
        ...mockRequest,
        confirmPassword: 'invalid_password',
      };
      const mockResponse: Observable<RegisterResponse> = of({
        status: 400,
        error: ['invalid_password_confirmation'],
        data: undefined,
      });
      jest.spyOn(client, 'register').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.register(mockInvalidConfirmPasswordRequest);

      // then
      expect(result).toEqual(mockResponse);
    });
  });

  describe('refreshToken', () => {
    // given
    const accountId = '39b64a86-1364-41dd-aba8-3d376fdafe16';
    const refreshToken = 'refresh_token';

    it('should refresh the access token and return a valid token', async () => {
      // given
      const mockResponse: Observable<RefreshTokenResponse> = of({
        status: 200,
        error: [],
        data: {
          accessToken: 'new_access_token',
          refreshToken: refreshToken,
        },
      });
      jest.spyOn(client, 'refreshToken').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.refreshToken(accountId, refreshToken);

      // then
      expect(result).toEqual(mockResponse);
    });

    it('should return an error response when an invalid refresh token is provided', async () => {
      // given
      const mockResponse: Observable<RefreshTokenResponse> = of({
        status: 401,
        error: ['unauthorized'],
        data: undefined,
      });
      jest.spyOn(client, 'refreshToken').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.refreshToken(accountId, refreshToken);

      // then
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    // given
    const accountId = '39b64a86-1364-41dd-aba8-3d376fdafe16';

    it('should log out the user and return a response', async () => {
      // given
      const mockResponse: Observable<LogoutResponse> = of({
        status: 200,
        error: [],
      });
      jest.spyOn(client, 'logout').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.logout(accountId);

      // then
      expect(result).toEqual(mockResponse);
    });

    it('should return an error response when an invalid token is provided', async () => {
      // given
      const mockResponse: Observable<LogoutResponse> = of({
        status: 401,
        error: ['unauthorized'],
      });
      jest.spyOn(client, 'logout').mockReturnValueOnce(mockResponse);

      // when
      const result = await controller.logout(accountId);

      // then
      expect(result).toEqual(mockResponse);
    });
  });
});
