import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, Min, IsEnum } from 'class-validator';
import { MenuCategory } from './enums';

/**
 * 메뉴 이름
 */
export const ApiMenuName = () =>
  ApiProperty({ description: '메뉴 이름', example: '짬뽕', maxLength: 200 });

/**
 * 메뉴 가격
 */
export const ApiMenuPrice = () =>
  ApiProperty({ description: '메뉴 가격', example: 9000, minimum: 0 });

/**
 * 메뉴 설명
 */
export const ApiMenuDescription = () =>
  ApiProperty({ description: '메뉴 설명', example: '얼큰하고 진한 국물의 해물 짬뽕' });

/**
 * 메뉴 카테고리
 */
export const ApiMenuCategory = (optional = false) =>
  (optional ? ApiPropertyOptional : ApiProperty)({
    description: '메뉴 카테고리',
    enum: MenuCategory,
    example: MenuCategory.CHINESE,
  });

/**
 * 공통 필드 묶어서 생성한 베이스 클래스
 */
export abstract class BaseMenuFields {
  @ApiMenuName()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiMenuPrice()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiMenuCategory()
  @IsEnum(MenuCategory)
  category: MenuCategory;

  @ApiMenuDescription()
  @IsString()
  @IsNotEmpty()
  description: string;
}
