import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerLoginForm, RestaurantLoginForm } from './forms';
import { LoginResponseDto } from './dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 고객 로그인
   * @param loginForm 고객 로그인 입력 정보
   * @returns JWT 토큰 정보
   */
  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  async customerLogin(@Body() loginForm: CustomerLoginForm): Promise<LoginResponseDto> {
    return await this.authService.customerLogin(loginForm);
  }

  /**
   * 식당 로그인
   * @param loginForm 식당 로그인 입력 정보
   * @returns JWT 토큰 정보
   */
  @Post('restaurant/login')
  @HttpCode(HttpStatus.OK)
  async restaurantLogin(@Body() loginForm: RestaurantLoginForm): Promise<LoginResponseDto> {
    return await this.authService.restaurantLogin(loginForm);
  }
}
