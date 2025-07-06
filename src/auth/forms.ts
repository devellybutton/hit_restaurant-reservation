import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 로그인 입력 정보 (공통)
 */
export class BaseLoginForm {
  @ApiProperty({ description: '로그인 아이디' })
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @ApiProperty({ description: '비밀번호' })
  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * 고객 로그인 입력 정보
 */
export class CustomerLoginForm extends BaseLoginForm {}

/**
 * 식당 로그인 입력 정보
 */
export class RestaurantLoginForm extends BaseLoginForm {}
