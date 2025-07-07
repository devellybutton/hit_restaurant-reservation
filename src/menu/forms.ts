import { ApiHideProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsNumber, Min, IsEnum, Validate } from 'class-validator';
import { MenuCategory } from './enums';
import { BaseMenuFields, ApiMenuCategory } from './menu-fields';
import { MinLessThanMaxConstraint } from 'src/util/valider';

/**
 * 메뉴 생성 요청 폼 DTO
 */
export class CreateMenuForm extends BaseMenuFields {}

/**
 * 메뉴 목록 조회 필터용 폼 DTO
 */
export class MenuFilterForm {
  @ApiPropertyOptional({ description: '메뉴 이름', example: '치즈 돈카츠 정식' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '최소 가격', example: 5000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ description: '최대 가격', example: 20000 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiMenuCategory(true)
  @IsOptional()
  @IsEnum(MenuCategory)
  category?: MenuCategory;

  // validtion용 더미
  @ApiHideProperty()
  @Validate(MinLessThanMaxConstraint)
  priceRangeCheck?: any;
}
