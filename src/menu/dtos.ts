import { ApiProperty } from '@nestjs/swagger';
import { BaseMenuFields } from './menu-fields';

/**
 * 메뉴 응답 DTO
 */
export class MenuResponseDto extends BaseMenuFields {
  @ApiProperty({ description: '메뉴 ID', example: 1 })
  id: number;

  @ApiProperty({ description: '소속 식당 이름', example: '맛있는 중식당' })
  restaurantName: string;

  @ApiProperty({ description: '생성 일시', example: '2025-07-06T18:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: '수정 일시', example: '2025-07-06T18:00:00.000Z' })
  updatedAt: Date;
}
