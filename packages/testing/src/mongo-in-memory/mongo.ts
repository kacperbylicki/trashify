import { DynamicModule } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

export class MongooseTestModule {
  private mongod: MongoMemoryServer | undefined;

  public forRoot(options: MongooseModuleOptions = {}): DynamicModule {
    return MongooseModule.forRootAsync({
      useFactory: async () => {
        this.mongod = await MongoMemoryServer.create();
        const uri = this.mongod.getUri();
        return { uri, ...options };
      },
    });
  }

  public async stop(): Promise<void> {
    if (this.mongod) {
      await this.mongod.stop();
    }
  }
}
