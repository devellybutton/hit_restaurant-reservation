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
   * 고객 회원가입
   * @param loginForm 고객 회원가입 입력 정보
   * @returns 가입된 회원 정보
   */
  @Post('customer/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입 (고객용)', description: '고객 계정으로 회원가입한다.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        loginId: { type: 'string', example: 'customer01' },
        password: { type: 'string', example: 'Password123' },
      },
      required: ['loginId', 'password'],
    },
  })
  async customerSignup(@Body() body: { loginId: string; password: string }) {
    const newCustomer = await this.authService.createCustomer(body);
    return ResponseUtil.success(newCustomer, '고객 회원가입 완료');
  }

  /**
   * 식당 회원가입
   * @param loginForm 식당 회원가입 입력 정보
   * @returns 가입된 식당 정보
   */
  @Post('restaurant/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '회원가입 (식당용)', description: '식당 계정으로 회원가입한다.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        loginId: { type: 'string', example: 'restaurant01' },
        password: { type: 'string', example: 'Password123' },
      },
      required: ['loginId', 'password'],
    },
  })
  async restaurantSignup(@Body() body: { loginId: string; password: string }) {
    const newRestaurant = await this.authService.createRestaurant(body);
    return ResponseUtil.success(newRestaurant, '식당 회원가입 완료');
  }

  /**
   * 고객 로그인
   * @param loginForm 고객 로그인 입력 정보
   * @returns JWT 토큰 정보
   */
  @Post('customer/login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '로그인 (고객용)', description: '고객 계정으로 로그인한다.' })
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
  @ApiOperation({ summary: '로그인 (식당용)', description: '식당 계정으로 로그인한다.' })
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
