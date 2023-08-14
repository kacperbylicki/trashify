import {
  AccountServiceClient,
  ValidateJwtRequest,
  ValidateJwtResponse,
  ValidateRefreshJwtRequest,
  ValidateRefreshJwtResponse,
} from '@trashify/transport';
import { JwtService } from '@/modules';
import { Test, TestingModule } from '@nestjs/testing';
import { createMock } from '@golevelup/ts-jest';
import { of } from 'rxjs';

describe('JwtService', () => {
  let jwtService: JwtService;
  let client: AccountServiceClient;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtService],
    })
      .useMocker(createMock)
      .compile();

    jwtService = module.get<JwtService>(JwtService);
    client = module.get<AccountServiceClient>(AccountServiceClient);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should call validateJwt with the correct payload', async () => {
      // given
      const mockRequest: ValidateJwtRequest = { accessToken: 'some_token' };
      const mockResponse: ValidateJwtResponse = {
        status: 200,
        error: [],
        data: {
          isValid: true,
          accountId: '39b64a86-1364-41dd-aba8-3d376fdafe16',
        },
      };
      jest.spyOn(client, 'validateJwt').mockReturnValueOnce(of(mockResponse));

      // when
      const result = await jwtService.validate(mockRequest);

      // then
      expect(client.validateJwt).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('validateRefreshToken', () => {
    it('should call validateRefreshJwt with the correct payload', async () => {
      // given
      const mockRequest: ValidateRefreshJwtRequest = {
        refreshToken: 'some_refresh_token',
      };
      const mockResponse: ValidateRefreshJwtResponse = {
        status: 200,
        error: [],
        data: {
          isValid: true,
          accountId: '39b64a86-1364-41dd-aba8-3d376fdafe16',
        },
      };
      jest.spyOn(client, 'validateRefreshJwt').mockReturnValueOnce(of(mockResponse));

      // when
      const result = await jwtService.validateRefreshToken(mockRequest);

      // then
      expect(client.validateRefreshJwt).toHaveBeenCalledWith(mockRequest);
      expect(result).toEqual(mockResponse);
    });
  });
});
