import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

interface SwaggerSetupOptions {
  swaggerOptions?: {
    persistAuthorization?: boolean;
    [key: string]: any;
  };
  customSiteTitle?: string;
  [key: string]: any;
}

/**
 * Swagger API 문서 설정
 * @param app NestJS 애플리케이션 인스턴스
 */
export const setupSwagger = (app: INestApplication): void => {
  const config = new DocumentBuilder()
    .setTitle('식당 예약 시스템 API')
    .setDescription('NestJS 기반의 식당 예약 시스템 Swagger 문서입니다.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT 토큰을 입력하세요.',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);

  const setupOptions: SwaggerSetupOptions = {
    swaggerOptions: {
      persistAuthorization: true, // 페이지 새로고침 시 인증정보 유지
    },
    customSiteTitle: 'NestJS 식당 예약 시스템',
  };

  SwaggerModule.setup('api-docs', app, document, setupOptions);
};
