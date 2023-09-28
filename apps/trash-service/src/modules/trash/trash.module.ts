import { Module } from '@nestjs/common';
import { TrashController } from './controllers';
import { TrashService } from './services';

@Module({
  controllers: [TrashController],
  providers: [TrashService],
})
export class TrashModule {}
