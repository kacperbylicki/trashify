import { AppConfig, AuthConfig, DatabaseConfig } from '@/config';
import { Config } from '@unifig/core';
import { EnvConfigAdapter } from '@unifig/adapter-env';
import { HttpExceptionFilter, accountProtobufPackage } from '@trashify/transport';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { toJSON } from '@unifig/validation-presenter-json';

(async (): Promise<void> => {
  const validationError = await Config.register({
    templates: [AppConfig, AuthConfig, DatabaseConfig],
    adapter: new EnvConfigAdapter(),
  });

  if (validationError) {
    // eslint-disable-next-line no-console
    console.error(toJSON(validationError));
    process.exit(1);
  }

  const { AppModule } = await import('./app.module');

  const { serviceUrl } = Config.getValues(AppConfig);

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: serviceUrl,
      package: accountProtobufPackage,
      protoPath: join(__dirname, `../proto/account.proto`),
    },
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen();
})();
