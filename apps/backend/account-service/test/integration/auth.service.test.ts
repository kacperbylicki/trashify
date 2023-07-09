import { Account, AuthService } from '@/modules';
import { AuthConfig } from '@/config';
import { Config, PlainConfigAdapter } from '@unifig/core';
import { ConfigModule } from '@unifig/nest';
import { HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthService', () => {
  let moduleRef: TestingModule;

  let authService: AuthService;
  let jwtService: JwtService;

  beforeAll(async () => {
    Config.registerSync({
      template: AuthConfig,
      adapter: new PlainConfigAdapter({
        JWT_ALGORITHM: 'HS512',
        JWT_ACCESS_TOKEN_SECRET: 'test_access_token_secret',
        JWT_ACCESS_TOKEN_TTL: '3600',
        JWT_REFRESH_TOKEN_SECRET: 'test_refresh_token_secret',
        JWT_REFRESH_TOKEN_TTL: '86400',
      }),
    });

    moduleRef = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(AuthConfig)],
      providers: [AuthService, JwtService],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    jwtService = moduleRef.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe('createTokensPair', () => {
    it('should create a valid access token and refresh token', async () => {
      // given
      const account: Account = {
        uuid: 'sample-uuid',
        email: 'test@example.com',
        username: 'testuser',
        password: '',
        createdAt: 0,
        updatedAt: 0,
      };

      // when
      const tokens = await authService.createTokensPair(account);

      // then
      expect(tokens).toBeDefined();
      expect(tokens.accessToken).toBeDefined();
      expect(tokens.refreshToken).toBeDefined();
    });
  });

  describe('validateJwt', () => {
    let accessToken: string;

    beforeEach(async () => {
      const account: Account = {
        uuid: 'sample-uuid',
        email: 'test@example.com',
        username: 'testuser',
        password: '',
        createdAt: 0,
        updatedAt: 0,
      };

      const accessTokenConfig = {
        secret: 'test_access_token_secret',
        expiresIn: 3600,
      };

      accessToken = await jwtService.signAsync(account, accessTokenConfig);
    });

    it('should validate a given JWT and return a response with status OK and isValid as true', async () => {
      // when
      const { status, data } = await authService.validateJwt(accessToken);

      // then
      expect(status).toBe(HttpStatus.OK);
      expect(data?.isValid).toBe(true);
      expect(data?.accountId).toBe('sample-uuid');
    });
  });

  describe('validateRefreshJwt', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const account: Account = {
        uuid: 'sample-uuid',
        email: 'test@example.com',
        username: 'testuser',
        password: '',
        createdAt: 0,
        updatedAt: 0,
      };

      const refreshTokenConfig = {
        secret: 'test_refresh_token_secret',
        expiresIn: 86400,
      };

      refreshToken = await jwtService.signAsync(account, refreshTokenConfig);
    });

    it('should validate a given refresh JWT and return a response with status OK and isValid as true', async () => {
      // when
      const { status, data } = await authService.validateRefreshJwt(
        refreshToken,
      );

      // then
      expect(status).toBe(HttpStatus.OK);
      expect(data?.isValid).toBe(true);
      expect(data?.accountId).toBe('sample-uuid');
    });
  });
});
