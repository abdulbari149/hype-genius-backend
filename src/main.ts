import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import validationOptions from './utils/validation-options';
import { SerializerInterceptor } from './utils/serializer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = await app.resolve(ConfigService);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.useGlobalInterceptors(new SerializerInterceptor());
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  app.setGlobalPrefix(config.get('app.prefix'), {
    exclude: ['/'],
  });
  await app.listen(config.get('app.port'));
}
bootstrap();
