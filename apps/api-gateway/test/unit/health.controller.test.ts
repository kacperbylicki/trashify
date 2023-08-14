import { HealthController, HealthModule } from '@/modules';
import { MemoryHealthIndicator } from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    })
      .overrideProvider(MemoryHealthIndicator)
      .useValue({ checkHeap: () => null })
      .compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should return healthy check response', async () => {
    const health = await controller.check();

    expect(health.status).toEqual('ok');
  });
});
