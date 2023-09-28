import { Module } from '@nestjs/common';
import { TrashModule } from '@/modules';

@Module({
  imports: [TrashModule],
})
export class AppModule {}
