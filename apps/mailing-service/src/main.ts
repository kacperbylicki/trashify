import { AppConfig, AzureConfig } from '@/config';
import { Config } from '@unifig/core';
import { EnvConfigAdapter } from '@unifig/adapter-env';
import { HttpExceptionFilter, mailingProtobufPackage } from '@trashify/transport';
import { INestMicroservice, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { toJSON } from '@unifig/validation-presenter-json';

async (): Promise<void> => {
  const validationError = await Config.register({
    templates: [AppConfig, AzureConfig],
    adapter: new EnvConfigAdapter(),
  });

  if (validationError) {
    // eslint-disable-next-line no-console
    console.error(toJSON(validationError));
    process.exit(1);
  }

  const { AppModule } = await import('./app.module');

  const { serviceUrl, protoPath } = Config.getValues(AppConfig);

  const app: INestMicroservice = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: serviceUrl,
      package: mailingProtobufPackage,
      protoPath: `${protoPath}/proto/mailing.proto`,
    },
  });

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen();
};
