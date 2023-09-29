import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TrashController } from './controllers';
import { TrashRepository } from './repository/trash.repository';
import { TrashSchema } from './entities/trash.entity';
import { TrashService } from './services';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Trash',
        schema: TrashSchema,
      },
    ]),
  ],
  controllers: [TrashController],
  providers: [TrashService, TrashRepository],
})
export class TrashModule {}
