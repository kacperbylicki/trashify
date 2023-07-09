import { AuthConfig } from '@/config';
import { AuthService } from '@/modules';
import { Config, PlainConfigAdapter } from '@unifig/core';
import { ConfigModule } from '@unifig/nest';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock as autoMocker } from '@golevelup/ts-jest';

describe('AuthService', () => {
  let moduleRef: TestingModule;
  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    Config.registerSync({
      template: AuthConfig,
      adapter: new PlainConfigAdapter({
        JWT_ALGORITHM: 'HS512',
        JWT_ACCESS_TOKEN_SECRET: 'test-access-token-secret',
        JWT_ACCESS_TOKEN_TTL: '3600',
        JWT_REFRESH_TOKEN_SECRET: 'test-refresh-token-secret',
        JWT_REFRESH_TOKEN_TTL: '86400',
      }),
    });

    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(AuthConfig)],
      providers: [AuthService],
    })
      .useMocker(autoMocker)
      .compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('createTokensPair', () => {
    it('should create tokens pair', async () => {
      // given
      const account = {
        uuid: '123',
        email: 'test@test.com',
        username: 'testuser',
      };

      const tokens = {
        accessToken: 'access_token',
        refreshToken: 'refresh_token',
      };

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValue(tokens.refreshToken);

      // when
      const result = await authService.createTokensPair(account);

      // then
      expect(result).toEqual(tokens);
    });
  });

  describe('validateJwt', () => {
    it('should validate access token', async () => {
      // given
      const accessToken = 'access_token';

      const decodedAccessToken = {
        uuid: '123',
        email: 'test@test.com',
        username: 'testuser',
      };

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue(decodedAccessToken);

      // when
      const { data, status } = await authService.validateJwt(accessToken);

      // then
      expect(status).toEqual(HttpStatus.OK);
      expect(data?.isValid).toBe(true);
      expect(data?.accountId).toEqual(decodedAccessToken.uuid);
    });
  });

  describe('validateRefreshJwt', () => {
    it('should validate refresh token', async () => {
      // given
      const refreshToken = 'refresh_token';

      const decodedRefreshToken = {
        uuid: '123',
        email: 'test@test.com',
        username: 'testuser',
      };

      jest
        .spyOn(jwtService, 'verifyAsync')
        .mockResolvedValue(decodedRefreshToken);

      // when
      const { data, status } = await authService.validateRefreshJwt(
        refreshToken,
      );

      // then
      expect(status).toEqual(HttpStatus.OK);
      expect(data?.isValid).toBe(true);
      expect(data?.accountId).toEqual(decodedRefreshToken.uuid);
    });
  });
});
