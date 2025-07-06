import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

/**
 * JWT 모듈 설정 생성
 * @param configService 환경변수 서비스
 * @returns JWT 모듈 옵션
 */
export const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  const secret = configService.get<string>('JWT_SECRET');

  if (!secret) {
    throw new Error('JWT 비밀키가 설정되지 않았습니다.');
  }

  return {
    secret,
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '24h',
    },
  };
};
