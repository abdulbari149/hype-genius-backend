import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { RequestMethod, ValidationPipe, VersioningType } from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { SerializerInterceptor } from './utils/serializer.interceptor';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.resolve(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  app.enableCors({
    credentials: true,
    origin: config.get('app.frontendDomain'),
  });

  app.use(cookieParser());

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  // Do not use '/:business' here: it matches any single path segment (e.g. "videos"),
  // which strips the global prefix from those routes and breaks /api/v1/videos.
  // Onboarding lives at /r/:code (VERSION_NEUTRAL) — exclude only that pattern.
  app.setGlobalPrefix(config.get('app.prefix'), {
    exclude: ['/', { path: 'r/:code', method: RequestMethod.GET }],
  });
  const port = process.env.PORT ?? config.get('app.port');
  await app.listen(port);
}
bootstrap();
