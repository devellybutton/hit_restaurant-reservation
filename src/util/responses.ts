import { ApiProperty } from '@nestjs/swagger';

/**
 * 성공 응답 DTO
 */
export class SuccessResponseDto<T = any> {
  @ApiProperty({
    description: '성공 여부',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: '응답 메시지',
    example: '요청이 성공적으로 처리되었습니다.',
  })
  message: string;

  @ApiProperty({
    description: '응답 데이터',
  })
  data?: T;

  constructor(data?: T, message = '요청이 성공적으로 처리되었습니다.') {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

/**
 * 에러 응답 DTO
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: '성공 여부',
    example: false,
  })
  success: boolean;

  @ApiProperty({
    description: '에러 메시지',
    example: '요청 처리 중 오류가 발생했습니다.',
  })
  message: string | string[];

  @ApiProperty({
    description: 'HTTP 상태 코드',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: '에러 타입',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    description: '에러 발생 시간',
    example: '2025-07-06T18:00:00.000Z',
  })
  timestamp: string;

  constructor(message: string | string[], statusCode: number, error: string) {
    this.success = false;
    this.message = message;
    this.statusCode = statusCode;
    this.error = error;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * 공통 응답 생성
 */
export class ResponseUtil {
  /**
   * 성공 응답 생성
   */
  static success<T>(data?: T, message?: string): SuccessResponseDto<T> {
    return new SuccessResponseDto(data, message);
  }

  /**
   * 생성 성공 응답
   */
  static created<T>(data: T, message = '성공적으로 생성되었습니다.'): SuccessResponseDto<T> {
    return new SuccessResponseDto(data, message);
  }

  /**
   * 삭제 성공 응답
   */
  static deleted(message = '성공적으로 삭제되었습니다.'): SuccessResponseDto<null> {
    return new SuccessResponseDto(null, message);
  }

  /**
   * 에러 응답 생성
   */
  static error(message: string | string[], statusCode: number, error: string): ErrorResponseDto {
    return new ErrorResponseDto(message, statusCode, error);
  }
}

/**
 * 공통 메시지 상수
 */
export const RESPONSE_MESSAGES = {
  // 인증 관련 (성공)
  LOGIN_SUCCESS: '로그인이 완료되었습니다.',
  RESTAURANT_LOGIN_SUCCESS: '식당 계정으로 로그인이 완료되었습니다.',
  CUSTOMER_LOGIN_SUCCESS: '고객 계정으로 로그인이 완료되었습니다.',

  // 인증 관련 (실패)
  UNAUTHORIZED: '인증 정보가 유효하지 않습니다.',
  FORBIDDEN_RESTAURANT: '식당 권한이 필요합니다.',
  FORBIDDEN_CUSTOMER: '고객 권한이 필요합니다.',
  PASSWORD_INVALID: '비밀번호가 일치하지 않습니다.',

  // 메뉴 관련 (성공)
  MENU_CREATED: '메뉴가 성공적으로 추가되었습니다.',
  MENU_DELETED: '메뉴가 성공적으로 삭제되었습니다.',
  MENU_LIST_RETRIEVED: '메뉴 목록 조회가 완료되었습니다.',

  // 메뉴 관련 (실패)
  MENU_NOT_FOUND: '메뉴를 찾을 수 없습니다.',
  MENU_FORBIDDEN: '본인 식당의 메뉴만 삭제할 수 있습니다.',

  // 식당 관련 (실패)
  RESTAURANT_NOT_FOUND: '메뉴를 찾을 수 없습니다.',

  // 고객 관련 (실패)
  CUSTOMER_NOT_FOUND: '고객 정보를 찾을 수 없습니다.',

  // 예약 관련 (성공)
  RESERVATION_CREATED: '예약이 성공적으로 생성되었습니다.',
  RESERVATION_UPDATED: '예약이 성공적으로 수정되었습니다.',
  RESERVATION_CANCELLED: '예약이 성공적으로 취소되었습니다.',
  RESERVATION_LIST_RETRIEVED: '예약 목록 조회가 완료되었습니다.',

  // 예약 관련 (실패)
  RESERVATION_NOT_FOUND: '예약을 찾을 수 없습니다.',
  RESERVATION_FORBIDDEN: '본인이 생성한 예약만 수정하거나 취소할 수 있습니다.',
  RESERVATION_START_IN_FUTURE: '예약 시간은 현재 시간보다 이후여야 합니다.',
  RESERVATION_END_AFTER_START: '종료 시간은 시작 시간보다 이후여야 합니다.',
  RESERVATION_MIN_DURATION: '예약 시간은 최소 30분 이상이어야 합니다.',
  RESERVATION_MAX_DURATION: '예약 시간은 최대 4시간까지 가능합니다.',
  RESERVATION_CONFLICT: '해당 시간에 이미 다른 예약이 있습니다.',
} as const;
