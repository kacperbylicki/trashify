import { AccountModule } from '../account';
import { AppConfig } from '../../config';
import { ClientGrpc, ClientProvider, ClientsModule, Transport } from '@nestjs/microservices';
import { Config } from '@unifig/core';
import { ConfigModule, getConfigContainerToken } from '@unifig/nest';
import { Module } from '@nestjs/common';
import { TRASH_PACKAGE_NAME, TRASH_SERVICE_NAME, TrashServiceClient } from '@trashify/transport';
import { TrashController } from './controllers/trash.controller';
import { join } from 'path';

@Module({
  controllers: [TrashController],
  imports: [
    AccountModule,
    ClientsModule.registerAsync([
      {
        name: TRASH_SERVICE_NAME,
        imports: [ConfigModule.forFeature(AppConfig)],
        inject: [getConfigContainerToken(AppConfig)],
        useFactory: async (): Promise<ClientProvider> => {
          const { trashServiceUrl } = Config.getValues(AppConfig);

          return {
            transport: Transport.GRPC,
            options: {
              url: trashServiceUrl,
              package: TRASH_PACKAGE_NAME,
              protoPath: join(__dirname, `../../../proto/trash.proto`),
            },
          };
        },
      },
    ]),
  ],
  providers: [
    {
      provide: TrashServiceClient,
      useFactory: (client: ClientGrpc): TrashServiceClient => {
        return client.getService<TrashServiceClient>(TRASH_SERVICE_NAME);
      },
      inject: [TRASH_SERVICE_NAME],
    },
  ],
})
export class TrashModule {}
