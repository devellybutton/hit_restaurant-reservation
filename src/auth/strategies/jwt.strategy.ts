import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload as CustomJwtPayload } from '../dtos';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * JWT 토큰 검증 전략
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    const secret = configService.get<string>('JWT_SECRET');

    if (!secret) throw new Error('JWT 비밀키가 없습니다.');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  /**
   * JWT 페이로드 검증
   * @param payload JWT에서 추출된 페이로드
   * @returns 검증된 회원 정보 (식당 혹은 고객)
   */
  validate(payload: any): CustomJwtPayload {
    const { id, loginId, type } = payload;

    if (!id || !loginId || !type) {
      throw new UnauthorizedException('잘못된 형식의 토큰입니다.');
    }

    return {
      id,
      loginId,
      type,
    };
  }
}
