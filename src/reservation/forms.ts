import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import {
  DateFieldDecorator,
  PhoneDecorator,
  GuestCountDecorator,
  MenuIdsDecorator,
} from './reservation-fields';
import { Type } from 'class-transformer';

/**
 * 예약 생성 폼
 */
export class CreateReservationForm {
  @ApiProperty({ description: '식당 ID', example: 1 })
  @IsNumber()
  restaurantId: number;

  @DateFieldDecorator('예약 시작 시간')
  startTime: string;

  @DateFieldDecorator('예약 종료 시간')
  endTime: string;

  @PhoneDecorator()
  phone: string;

  @GuestCountDecorator()
  guestCount: number;

  @MenuIdsDecorator()
  menuIds: number[];
}

/**
 * 예약 수정 폼
 */
export class UpdateReservationForm {
  @GuestCountDecorator(false)
  guestCount?: number;

  @MenuIdsDecorator(false)
  menuIds?: number[];
}

/**
 * 예약 조회 필터 폼
 */
export class ReservationFilterForm {
  @ApiPropertyOptional({
    description: '전화번호 부분 검색',
    example: '010-1234',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: '예약 날짜 (YYYY-MM-DD)',
    example: '2025-07-07',
  })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({
    description: '최소 인원수',
    example: 4,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  minGuestCount?: number;

  @ApiPropertyOptional({
    description: '포함 메뉴 이름 검색',
    example: '짬뽕',
  })
  @IsOptional()
  @IsString()
  menuName?: string;
}
