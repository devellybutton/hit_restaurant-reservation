import { ApiProperty } from '@nestjs/swagger';

/**
 * 공통 ID 필드
 */
class BaseIdDto {
  @ApiProperty({ description: 'ID', example: 1 })
  id: number;
}

/**
 * 공통 타임스탬프 필드
 */
class BaseTimestampDto {
  @ApiProperty({ description: '생성 일시', example: '2025-07-06T18:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시', example: '2025-07-06T18:00:00.000Z' })
  updatedAt: Date;
}

/**
 * 메뉴 요약 DTO
 */
export class MenuSummaryDto extends BaseIdDto {
  @ApiProperty({ description: '메뉴 이름', example: '짬뽕' })
  name: string;

  @ApiProperty({ description: '메뉴 가격', example: 8000 })
  price: number;

  @ApiProperty({ description: '메뉴 카테고리', example: '중식' })
  category: string;
}

/**
 * 식당 개요 DTO
 */
export class RestaurantSummaryDto extends BaseIdDto {
  @ApiProperty({ description: '식당 이름', example: '맛있는 한식당' })
  name: string;

  @ApiProperty({ description: '식당 전화번호', example: '02-1234-5678' })
  phone: string;
}

/**
 * 고객 개요 DTO
 */
export class CustomerSummaryDto extends BaseIdDto {
  @ApiProperty({ description: '고객 로그인 ID', example: 'customer01' })
  loginId: string;
}

/**
 * 예약 응답 DTO
 */
export class ReservationResponseDto extends BaseTimestampDto {
  @ApiProperty({ description: '예약 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '예약 인원수', example: 4 })
  guestCount: number;

  @ApiProperty({ description: '예약 시작 시간', example: '2025-07-07T19:00:00.000Z' })
  startTime: Date;

  @ApiProperty({ description: '예약 종료 시간', example: '2025-07-07T21:00:00.000Z' })
  endTime: Date;

  @ApiProperty({ description: '예약자 전화번호', example: '010-1234-5678' })
  phone: string;

  @ApiProperty({ description: '예약한 식당 정보', type: RestaurantSummaryDto })
  restaurant: RestaurantSummaryDto;

  @ApiProperty({ description: '예약한 고객 정보', type: CustomerSummaryDto })
  customer: CustomerSummaryDto;

  @ApiProperty({ description: '주문한 메뉴 목록', type: [MenuSummaryDto] })
  menus: MenuSummaryDto[];

  @ApiProperty({ description: '총 금액', example: 23000 })
  totalAmount: number;
}
