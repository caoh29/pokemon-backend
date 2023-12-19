import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Adds a global prefix to all routes. Example: http://localhost:4000/api/...
  app.setGlobalPrefix('api');
  // Enables validation of DTOs. Example: http://localhost:4000/api/...?name=...
  // whiteList: Removes extra properties that are not included in the DTO class
  // forbidNonWhiteListed: Returns bad request if there are properties not require in the Request
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  await app.listen(4000);
}
bootstrap();
