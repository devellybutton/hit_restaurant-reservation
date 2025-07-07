import { applyDecorators } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  Matches,
  IsNumber,
  Min,
  IsArray,
  ArrayMinSize,
  IsDateString,
} from 'class-validator';

/**
 * 전화번호 필드용 데코레이터
 *
 * - Swagger 문서에 전화번호 설명 및 예시 추가
 * - 9~11자리 숫자 형식 검증
 * - 필수 여부에 따라 `@IsNotEmpty` 또는 `@IsOptional` 적용
 *
 * @param required 해당 필드가 필수인지 여부 (기본값: true)
 * @returns 데코레이터 집합
 */
export function PhoneDecorator(required = true) {
  return applyDecorators(
    required
      ? ApiProperty({ description: '전화번호', example: '01012345678' })
      : ApiPropertyOptional({ description: '전화번호', example: '01012345678' }),
    IsString(),
    required ? IsNotEmpty() : IsOptional(),
    Matches(/^\d{9,11}$/, {
      message: '전화번호는 9~11자리 숫자여야 합니다.',
    }),
  );
}

/**
 * 예약 인원 필드용 데코레이터
 *
 * - Swagger 문서에 설명, 예제, 최소값(1) 추가
 * - 유효성 검사: `@IsNumber`, `@Min(1)`
 * - 필수 여부에 따라 `@IsNotEmpty` 또는 `@IsOptional` 적용
 *
 * @param required 해당 필드가 필수인지 여부 (기본값: true)
 * @returns 데코레이터 집합
 */
export function GuestCountDecorator(required = true) {
  return applyDecorators(
    required
      ? ApiProperty({ description: '예약 인원수', example: 4, minimum: 1 })
      : ApiPropertyOptional({ description: '예약 인원수', example: 4, minimum: 1 }),
    IsNumber({}, { message: '예약 인원수는 숫자여야 합니다.' }),
    Min(1, { message: '예약 인원수는 최소 1명 이상이어야 합니다.' }),
    required ? IsNotEmpty({ message: '예약 인원수는 필수 입력입니다.' }) : IsOptional(),
  );
}

/**
 * 메뉴 ID 배열 필드용 데코레이터
 *
 * - Swagger 문서에 설명, 예제, 타입 추가
 * - 유효성 검사:
 *   - 배열(`@IsArray`)
 *   - 최소 1개 이상(`@ArrayMinSize(1)`)
 *   - 각 요소 숫자(`@IsNumber({}, { each: true })`)
 * - 필수 여부에 따라 `@IsNotEmpty` 또는 `@IsOptional` 적용
 *
 * @param required 해당 필드가 필수인지 여부 (기본값: true)
 * @returns 데코레이터 집합
 */
export function MenuIdsDecorator(required = true) {
  return applyDecorators(
    required
      ? ApiProperty({ description: '주문할 메뉴 ID 목록', example: [1, 2], type: [Number] })
      : ApiPropertyOptional({
          description: '주문할 메뉴 ID 목록',
          example: [1, 2],
          type: [Number],
        }),
    IsArray({ message: '메뉴 ID는 배열이어야 합니다.' }),
    ArrayMinSize(1, { message: '최소 1개의 메뉴를 선택해야 합니다.' }),
    IsNumber({}, { each: true, message: '모든 메뉴 ID는 숫자여야 합니다.' }),
    required ? IsNotEmpty({ message: '메뉴 ID 목록은 필수 입력입니다.' }) : IsOptional(),
  );
}

/**
 * ISO 8601 날짜 필드용 데코레이터
 *
 * - Swagger 문서에 `name` 기반 설명과 예제 추가
 * - 유효성 검사: `@IsDateString`
 * - 필수 여부에 따라 `@IsNotEmpty` 또는 `@IsOptional` 적용
 *
 * @param name 필드의 의미(예: '예약 시작 시간')
 * @param required 해당 필드가 필수인지 여부 (기본값: true)
 * @returns 데코레이터 집합
 */
export function DateFieldDecorator(name: string, required = true) {
  return applyDecorators(
    required
      ? ApiProperty({ description: `${name} (ISO 8601)`, example: '2025-07-07T10:00:00Z' })
      : ApiPropertyOptional({ description: `${name} (ISO 8601)`, example: '2025-07-07T10:00:00Z' }),
    IsDateString(
      {},
      { message: `${name}은(는) ISO 8601 형식의 날짜여야 합니다. (시간: 00:00~23:59)` },
    ),
    required ? IsNotEmpty({ message: `${name}은(는) 필수 입력입니다.` }) : IsOptional(),
  );
}
