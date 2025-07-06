import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtPayload } from '../dtos';

/**
 * 고객 인증 가드
 * JWT 토큰 검증 + 고객 타입 확인
 */
@Injectable()
export class CustomerAuthGuard extends AuthGuard('jwt') implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 먼저 JWT 검증
    const result = await super.canActivate(context);
    if (!result) {
      return false;
    }

    // 사용자 타입이 customer인지 확인
    const request = context.switchToHttp().getRequest();
    const user: JwtPayload = request.user;

    if (user.type !== 'customer') {
      throw new UnauthorizedException('고객 권한이 필요합니다.');
    }

    return true;
  }
}
