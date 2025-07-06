/**
 * 로그인 응답 DTO
 */
export class LoginResponseDto {
  accessToken: string;
  tokenType: string;
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
