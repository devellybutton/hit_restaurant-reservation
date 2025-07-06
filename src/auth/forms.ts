import { IsString, IsNotEmpty } from 'class-validator';

/**
 * 고객 로그인 입력 정보
 */
export class CustomerLoginForm {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

/**
 * 식당 로그인 입력 정보
 */
export class RestaurantLoginForm {
  @IsString()
  @IsNotEmpty()
  loginId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
