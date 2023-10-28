import argon2 from 'argon2';
import dayjs from 'dayjs';
import {
  Account,
  AccountConstraints,
  AccountRepository,
  AccountSchema,
  AccountService,
  AuthService,
  EmailConfirmationToken,
  EmailConfirmationTokenSchema,
  LoginRequestDto,
  RefreshTokenRequestDto,
  RegisterRequestDto,
  ResetPasswordToken,
  ResetPasswordTokenSchema,
  accountModuleProviders,
} from '@/modules';
import { AccountTestFactory } from '../factories/account-test.factory';
import { AuthConfig } from '@/config';
import { Config, PlainConfigAdapter } from '@unifig/core';
import { ConfigModule } from '@unifig/nest';
import { EMAIL_VERIFICATION_FEATURE_FLAG } from '../../src/modules/account/symbols';
import {
  EmailConfirmationTokenCacheService,
  ResetPasswordTokenCacheService,
} from '../../src/modules/account/cache';
import { HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { MongooseModule, getConnectionToken, getModelToken } from '@nestjs/mongoose';
import { MongooseTestModule, UserDataGenerator } from '@trashify/testing';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 as uuidv4 } from 'uuid';

describe('AccountService', () => {
  const mongooseTestModule = new MongooseTestModule();

  const accountTestFactory = new AccountTestFactory();

  let moduleRef: TestingModule;

  let accountService: AccountService;
  let accountServiceWithFlagActive: AccountService;
  let accountRepository: AccountRepository;

  let accountModel: Model<Account>;
  let resetPasswordTokenModel: Model<ResetPasswordToken>;

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
      imports: [
        mongooseTestModule.forRoot(),
        MongooseModule.forFeature([
          { name: Account.name, schema: AccountSchema },
          {
            name: ResetPasswordToken.name,
            schema: ResetPasswordTokenSchema,
          },
          {
            name: EmailConfirmationToken.name,
            schema: EmailConfirmationTokenSchema,
          },
        ]),
        ConfigModule.forFeature(AuthConfig),
      ],
      providers: [
        ...accountModuleProviders,
        {
          provide: EMAIL_VERIFICATION_FEATURE_FLAG,
          useValue: false,
        },
      ],
    }).compile();

    accountService = moduleRef.get<AccountService>(AccountService);
    accountRepository = moduleRef.get(AccountRepository);
    accountModel = moduleRef.get<Model<Account>>(getModelToken(Account.name));
    resetPasswordTokenModel = moduleRef.get<Model<ResetPasswordToken>>(
      getModelToken(ResetPasswordToken.name),
    );
    accountServiceWithFlagActive = new AccountService(
      moduleRef.get(AuthService),
      moduleRef.get(ResetPasswordTokenCacheService),
      moduleRef.get(EmailConfirmationTokenCacheService),
      moduleRef.get(AccountRepository),
      true,
    );
  });

  beforeEach(async () => {
    await accountModel.deleteMany({});
  });

  afterAll(async () => {
    const connection = await moduleRef.get(getConnectionToken());
    await connection.close();
    await mongooseTestModule.stop();
    await moduleRef.close();
  });

  describe('findById', () => {
    it('should return null if account does not exist', async () => {
      const result = await accountService.findById('non-existent-uuid');

      expect(result).toBeNull();
    });

    it('should return the account if it exists', async () => {
      const account = accountTestFactory.create({});

      await accountModel.create(account);

      const result = await accountService.findById(account.uuid);

      expect(result?.uuid).toEqual(account.uuid);
      expect(result?.email).toEqual(account.email);
      expect(result?.password).toEqual(account.password);
      expect(result?.createdAt).toEqual(account.createdAt);
      expect(result?.updatedAt).toEqual(account.updatedAt);
    });
  });

  describe('findByEmail', () => {
    it('should return null if account does not exist', async () => {
      const result = await accountService.findByEmail('non-existent-email@example.com');

      expect(result).toBeNull();
    });

    it('should return the account if it exists', async () => {
      const account = accountTestFactory.create({});

      await accountModel.create(account);

      const result = await accountService.findByEmail(account.email);

      expect(result?.uuid).toEqual(account.uuid);
      expect(result?.email).toEqual(account.email);
      expect(result?.password).toEqual(account.password);
      expect(result?.createdAt).toEqual(account.createdAt);
      expect(result?.updatedAt).toEqual(account.updatedAt);
    });
  });

  describe('getCurrentAccount', () => {
    let accountId: string;

    let registerPayload: RegisterRequestDto;

    beforeEach(async () => {
      // given
      const password = UserDataGenerator.password(10);

      registerPayload = {
        email: UserDataGenerator.email(),
        username: UserDataGenerator.username(),
        password: password,
        confirmPassword: password,
      };

      await accountService.register(registerPayload);
      const account = await accountRepository.findByEmail(registerPayload.email);
      accountId = account?.uuid ?? '';
    });

    it('should return the current account', async () => {
      // when
      const { data, status } = await accountService.getCurrentAccount(accountId);

      // then
      expect(status).toEqual(HttpStatus.OK);
      expect(data?.uuid).toEqual(accountId);
      expect(data?.email).toEqual(registerPayload.email);
    });

    it('should return null if account ID is incorrect', async () => {
      // given
      const incorrectAccountId = uuidv4();

      // when
      const response = await accountService.getCurrentAccount(incorrectAccountId);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.data).toBeNull();
    });
  });

  describe('register', () => {
    // given
    const password = UserDataGenerator.password(10);

    const payload: RegisterRequestDto = {
      email: UserDataGenerator.email(),
      username: UserDataGenerator.username(),
      password: password,
      confirmPassword: password,
    };

    it('should create a new account and return HttpStatus.CREATED', async () => {
      // when
      const response = await accountService.register(payload);

      // then
      expect(response.status).toEqual(HttpStatus.CREATED);
      const account = await accountRepository.findByEmail(payload.email);
      expect(account).not.toBeNull();
      expect(account?.uuid).toBeDefined();
      expect(account?.email).toEqual(payload.email);
      expect(await argon2.verify(account?.password ?? '', payload.password)).toBe(true);
    });

    it(`should return HttpStatus.UNPROCESSABLE_ENTITY with message "Email already taken.`, async () => {
      // given
      await accountService.register(payload);

      // when
      const response = await accountService.register(payload);

      // then
      expect(response.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.error).toEqual(['Email already taken.']);
    });

    it('should return HttpStatus.UNPROCESSABLE_ENTITY if passwords do not match', async () => {
      // given
      const payloadWithMismatchedPasswords: RegisterRequestDto = {
        ...payload,
        confirmPassword: 'wrong123',
      };

      // when
      const response = await accountService.register(payloadWithMismatchedPasswords);

      // then
      expect(response.status).toEqual(HttpStatus.UNPROCESSABLE_ENTITY);
      expect(response.error).toEqual(['Passwords do not match.']);
    });
  });

  describe('login', () => {
    // given
    const password = UserDataGenerator.password(10);

    const payload: RegisterRequestDto = {
      email: UserDataGenerator.email(),
      username: UserDataGenerator.username(),
      password: password,
      confirmPassword: password,
    };

    beforeEach(async () => {
      await accountService.register(payload);
    });

    it('should successfully log in and return tokens', async () => {
      // given
      const loginPayload: LoginRequestDto = {
        email: payload.email,
        password: payload.password,
      };

      // when
      const { status, data } = await accountService.login(loginPayload);

      // then
      expect(status).toEqual(HttpStatus.OK);
      expect(data?.accessToken).toBeDefined();
      expect(data?.refreshToken).toBeDefined();
    });

    it('should return HttpStatus.UNAUTHORIZED if email is incorrect', async () => {
      // given
      const loginPayload: LoginRequestDto = {
        email: payload.email + 'XDDDD',
        password: payload.password,
      };

      // when
      const response = await accountService.login(loginPayload);

      // then
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(response.error).toEqual([`Invalid email or password.`]);
    });

    it('should return HttpStatus.UNAUTHORIZED if password is incorrect', async () => {
      // given
      const loginPayload: LoginRequestDto = {
        email: payload.email,
        password: payload.password + 'XDDDD',
      };

      // when
      const response = await accountService.login(loginPayload);

      // then
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(response.error).toEqual(['Invalid email or password.']);
    });
  });

  describe('login - when emailFeatureFlag is enabled', () => {
    it('throws an error - when email is not confirmed', async () => {
      const pass = UserDataGenerator.password(10);

      const account = accountTestFactory.create({
        emailConfirmed: false,
        password: await argon2.hash(pass),
      });

      await accountModel.create(account);

      const response = await accountServiceWithFlagActive.login({
        email: account.email,
        password: pass,
      });

      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(response.error).toEqual(['Email not confirmed.']);
    });

    it('returns tokens pair', async () => {
      const pass = UserDataGenerator.password(10);

      const account = accountTestFactory.create({
        emailConfirmed: true,
        password: await argon2.hash(pass),
      });

      await accountModel.create(account);

      const response = await accountServiceWithFlagActive.login({
        email: account.email,
        password: pass,
      });

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.data?.accessToken).toBeDefined();
      expect(response.data?.refreshToken).toBeDefined();
    });
  });

  describe('refreshToken', () => {
    let accountId: string;
    let refreshToken: string;

    beforeEach(async () => {
      // given
      const password = UserDataGenerator.password(10);

      const registerPayload: RegisterRequestDto = {
        email: UserDataGenerator.email(),
        username: UserDataGenerator.username(),
        password: password,
        confirmPassword: password,
      };

      await accountService.register(registerPayload);

      const loginPayload: LoginRequestDto = {
        email: registerPayload.email,
        password: registerPayload.password,
      };
      const { data } = await accountService.login(loginPayload);
      const account = await accountRepository.findByEmail(registerPayload.email);

      accountId = account?.uuid ?? '';
      refreshToken = data?.refreshToken ?? '';
    });

    it('should successfully refresh tokens', async () => {
      // given
      const refreshTokenRequest: RefreshTokenRequestDto = {
        accountId,
        refreshToken,
      };

      // when
      const { status, data } = await accountService.refreshToken(refreshTokenRequest);

      // then
      expect(status).toEqual(HttpStatus.OK);
      expect(data?.accessToken).toBeDefined();
      expect(data?.refreshToken).toBeDefined();
    });

    it('should return HttpStatus.UNAUTHORIZED if refresh token is incorrect', async () => {
      // given
      const incorrectRefreshToken = 'wrong-refresh-token';

      // when
      const refreshTokenRequest: RefreshTokenRequestDto = {
        accountId,
        refreshToken: incorrectRefreshToken,
      };
      const response = await accountService.refreshToken(refreshTokenRequest);

      // then
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(response.error).toEqual(['Invalid refresh token.']);
    });

    it('should return HttpStatus.UNAUTHORIZED if account ID is incorrect', async () => {
      // given
      const incorrectAccountId = uuidv4();

      // when
      const refreshTokenRequest: RefreshTokenRequestDto = {
        accountId: incorrectAccountId,
        refreshToken,
      };
      const response = await accountService.refreshToken(refreshTokenRequest);

      // then
      expect(response.status).toEqual(HttpStatus.UNAUTHORIZED);
      expect(response.error).toEqual(['Invalid refresh token.']);
    });
  });

  describe('logout', () => {
    let accountId: string;

    beforeEach(async () => {
      // given
      const password = UserDataGenerator.password(10);

      const registerPayload: RegisterRequestDto = {
        email: UserDataGenerator.email(),
        username: UserDataGenerator.username(),
        password: password,
        confirmPassword: password,
      };

      await accountService.register(registerPayload);

      const loginPayload: LoginRequestDto = {
        email: registerPayload.email,
        password: registerPayload.password,
      };
      await accountService.login(loginPayload);
      const account = await accountRepository.findByEmail(registerPayload.email);
      accountId = account?.uuid ?? '';
    });

    it('should successfully log out and clear refresh token', async () => {
      // when
      const response = await accountService.logout(accountId);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
      const account = await accountRepository.findById(accountId);
      expect(account?.refreshToken).toBeNull();
    });

    it('should return HttpStatus.OK even if account ID is incorrect', async () => {
      // given
      const incorrectAccountId = uuidv4();

      // when
      const response = await accountService.logout(incorrectAccountId);

      // then
      expect(response.status).toEqual(HttpStatus.OK);
    });
  });

  describe('changeEmail', () => {
    it('returns an error - when email is already taken', async () => {
      const user1 = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        uuid: uuidv4(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
      });

      const user2 = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        uuid: uuidv4(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
      });

      const res = await accountService.changeEmail({
        email: user1.email,
        uuid: user2.uuid,
      });

      expect(res.email).toEqual(user1.email);
      expect(res?.error ? res.error[0] : null).toEqual('Email already taken.');
    });

    it('returns an error - when user does not exist', async () => {
      const user1 = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        uuid: uuidv4(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
      });

      const res = await accountService.changeEmail({
        email: user1.email,
        uuid: UserDataGenerator.uuid(),
      });

      expect(res.email).toEqual(user1.email);
      expect(res?.error ? res.error[0] : null).toEqual('Email already taken.');
    });

    it('changes user email', async () => {
      const user = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        uuid: uuidv4(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
      });

      const newEmail = UserDataGenerator.email();

      const res = await accountService.changeEmail({
        email: newEmail,
        uuid: user.uuid,
      });

      expect(res.status).toEqual(HttpStatus.OK);

      const rawUser = await accountModel.findOne({ uuid: user.uuid });

      expect(rawUser?.email).toEqual(newEmail);
    });
  });

  describe('changeEmail - given emailVerificationFlag is enabled', () => {
    it('throws an error - if email already exists', async () => {
      const existingAccount = accountTestFactory.create({});

      const accountTryingDuplicate = accountTestFactory.create({});

      await accountModel.create(existingAccount, accountTryingDuplicate);

      const response = await accountServiceWithFlagActive.changeEmail({
        email: existingAccount.email,
        uuid: accountTryingDuplicate.uuid,
      });

      expect(response.status).toEqual(HttpStatus.CONFLICT);
      expect(response.error).toEqual(['Email already taken.']);

      const rawAccount = await accountModel.findOne({ uuid: accountTryingDuplicate.uuid }).lean();

      expect(rawAccount).toMatchObject(accountTryingDuplicate);
    });

    it('throws an error - if user does not exist', async () => {
      const response = await accountServiceWithFlagActive.changeEmail({
        email: UserDataGenerator.email(),
        uuid: UserDataGenerator.uuid(),
      });

      expect(response.status).toEqual(HttpStatus.CONFLICT);

      expect(response.error).toEqual(['Email already taken.']);
    });

    it('updates newEmail field', async () => {
      const existingAccount = accountTestFactory.create({});

      await accountModel.create(existingAccount);

      const newEmail = UserDataGenerator.email();

      const response = await accountServiceWithFlagActive.changeEmail({
        email: newEmail,
        uuid: existingAccount.uuid,
      });

      expect(response.status).toEqual(HttpStatus.OK);
      expect(response.username).toEqual(existingAccount.username);

      const rawAccount = await accountModel.findOne({ uuid: existingAccount.uuid }).lean();

      expect(rawAccount).toMatchObject({
        ...existingAccount,
        updatedAt: expect.any(Number),
      });
    });
  });

  describe('changeUsername', () => {
    it('return an error - when user does not exist', async () => {
      const uuid = UserDataGenerator.uuid();

      const res = await accountService.changeUsername({
        username: UserDataGenerator.username(),
        uuid,
      });

      expect(res.status).toEqual(HttpStatus.BAD_REQUEST);

      expect(res?.error ? res.error[0] : null).toEqual('User not found.');
    });

    it('updates account username', async () => {
      const account = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
        uuid: UserDataGenerator.uuid(),
      });

      const newUsername = UserDataGenerator.username();

      const res = await accountService.changeUsername({
        username: newUsername,
        uuid: account.uuid,
      });

      expect(res.status).toEqual(HttpStatus.OK);

      const rawAccount = await accountModel.findOne({
        uuid: account.uuid,
      });

      expect(rawAccount?.username).toEqual(newUsername);
    });
  });

  describe('createResetPasswordToken', () => {
    it('returns an error - when user does not exist', async () => {
      const email = UserDataGenerator.email();

      const result = await accountService.createResetPasswordToken({
        email,
      });

      expect(result.status).toEqual(HttpStatus.BAD_REQUEST);

      expect(result?.error ? result?.error[0] : null).toEqual('User does not exist.');
    });

    it('creates and persists resetPasswordToken', async () => {
      const account = await accountModel.create({
        createdAt: dayjs().unix(),
        updatedAt: dayjs().unix(),
        email: UserDataGenerator.email(),
        password: UserDataGenerator.password(AccountConstraints.PasswordMinLength),
        username: UserDataGenerator.username(),
        uuid: UserDataGenerator.uuid(),
      });

      const result = await accountService.createResetPasswordToken({
        email: account.email,
      });

      expect(result.status).toEqual(HttpStatus.OK);

      const rawToken = await resetPasswordTokenModel.findOne({
        accountUuid: account.uuid,
      });

      expect(rawToken).toBeDefined();
    });
  });
});
