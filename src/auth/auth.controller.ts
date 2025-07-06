import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerLoginForm, RestaurantLoginForm } from './forms';
import { LoginResponseDto } from './dtos';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';

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
  @ApiOperation({ summary: '고객 로그인', description: '고객 계정으로 로그인한다.' })
  @ApiBody({ type: CustomerLoginForm })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '로그인 실패 (잘못된 로그인 정보)' })
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
  @ApiOperation({ summary: '식당 로그인', description: '식당 계정으로 로그인한다.' })
  @ApiBody({ type: RestaurantLoginForm })
  @ApiResponse({ status: 200, description: '로그인 성공', type: LoginResponseDto })
  @ApiResponse({ status: 401, description: '로그인 실패 (잘못된 로그인 정보)' })
  async restaurantLogin(@Body() loginForm: RestaurantLoginForm): Promise<LoginResponseDto> {
    return await this.authService.restaurantLogin(loginForm);
  }
}
