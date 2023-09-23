import fastifyCompress from '@fastify/compress';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import path from 'path';
import { AppConfig } from '@/config';
import { Config } from '@unifig/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { EnvConfigAdapter } from '@unifig/adapter-env';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';
import { RequestMethod } from '@nestjs/common';
import { fastifyStatic } from '@fastify/static';
import { toJSON } from '@unifig/validation-presenter-json';

(async (): Promise<void> => {
  const validationError = await Config.register({
    template: AppConfig,
    adapter: new EnvConfigAdapter(),
  });

  if (validationError) {
    // eslint-disable-next-line no-console
    console.error(toJSON(validationError));
    process.exit(1);
  }

  const { AppModule } = await import('./app.module');

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  );

  await app.register(fastifyHelmet);
  await app.register(fastifyCompress);
  await app.register(fastifyCors);
  await app.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public/',
  });

  app.setGlobalPrefix('/api/v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('The Boring Playgrounds')
    .setVersion('1.0')
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/docs', app, swaggerDocument);

  await app.listen(Config.getValues(AppConfig).port);
})();
