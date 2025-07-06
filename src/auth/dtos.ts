import { ApiProperty } from '@nestjs/swagger';

/**
 * 로그인 응답 DTO
 */
export class LoginResponseDto {
  @ApiProperty({ description: 'JWT 액세스 토큰' })
  accessToken: string;

  @ApiProperty({ description: '토큰 타입 (Bearer)', example: 'Bearer' })
  tokenType: string;

  @ApiProperty({ description: '만료 시간 (예: 2시간)', example: '2h' })
  expiresIn: string | number;
}

/**
 * JWT 페이로드 타입
 */
export interface JwtPayload {
  id: number;
  loginId: string;
  type: 'customer' | 'restaurant';
}
