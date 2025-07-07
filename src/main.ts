import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './util/swagger';
import { HttpExceptionFilter } from './util/http-exception.filter';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 없는 값 제거
      forbidNonWhitelisted: true, // DTO 외 값 있으면 에러
      transform: true, // payload를 DTO 클래스로 변환
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
