import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.resolve(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.setGlobalPrefix(config.get('app.prefix'));
  await app.listen(config.get('app.port'));
}
bootstrap();
