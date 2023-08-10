import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { TimeoutInterceptor } from '@/common';

@Controller('health')
@ApiTags(HealthController.name)
@UseInterceptors(TimeoutInterceptor)
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly memory: MemoryHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check(): Promise<HealthCheckResult> {
    const checkHeap = (): Promise<HealthIndicatorResult> =>
      this.memory.checkHeap('memory_heap', 150 * 1024 * 1024);

    return this.health.check([checkHeap]);
  }
}
