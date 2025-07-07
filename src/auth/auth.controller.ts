import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CustomerLoginForm, RestaurantLoginForm } from './forms';
import { LoginResponseDto } from './dtos';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import {
  ErrorResponseDto,
  RESPONSE_MESSAGES,
  ResponseUtil,
  SuccessResponseDto,
} from 'src/util/responses';

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
  @ApiResponse({ status: 200, description: '로그인 성공', type: SuccessResponseDto })
  @ApiResponse({
    status: 401,
    description: '로그인 실패 (잘못된 로그인 정보)',
    type: ErrorResponseDto,
  })
  async customerLogin(
    @Body() loginForm: CustomerLoginForm,
  ): Promise<SuccessResponseDto<LoginResponseDto>> {
    const token = await this.authService.customerLogin(loginForm);
    return ResponseUtil.success(token, RESPONSE_MESSAGES.CUSTOMER_LOGIN_SUCCESS);
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
  @ApiResponse({
    status: 401,
    description: '로그인 실패 (잘못된 로그인 정보)',
    type: ErrorResponseDto,
  })
  async restaurantLogin(
    @Body() loginForm: RestaurantLoginForm,
  ): Promise<SuccessResponseDto<LoginResponseDto>> {
    const token = await this.authService.restaurantLogin(loginForm);
    return ResponseUtil.success(token, RESPONSE_MESSAGES.RESTAURANT_LOGIN_SUCCESS);
  }
}
