import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrashController } from './controllers';
import { TrashRawEntity, TrashSchema } from './entities/trash.entity';
import { TrashRepository } from './repository/trash.repository';
import { TrashService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: TrashRawEntity.name,
        schema: TrashSchema,
      },
    ]),
  ],
  controllers: [TrashController],
  providers: [TrashService, TrashRepository],
})
export class TrashModule {}
