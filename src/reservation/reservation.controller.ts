import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationService } from './reservation.service';
import { CreateReservationForm, UpdateReservationForm, ReservationFilterForm } from './forms';
import { ReservationResponseDto } from './dtos';
import { JwtPayload } from '../auth/dtos';
import { CustomerAuthGuard } from 'src/auth/guards/customer-auth.guard';
import { RestaurantAuthGuard } from 'src/auth/guards/restaurant-auth.guard';
import {
  SuccessResponseDto,
  ErrorResponseDto,
  RESPONSE_MESSAGES,
  ResponseUtil,
} from 'src/util/responses';

/**
 * 예약 컨트롤러
 * 고객의 예약 CRUD 및 식당의 예약 조회 기능 제공
 */
@ApiTags('Reservation')
@ApiBearerAuth()
@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  /**
   * 예약 생성 (고객용)
   */
  @Post()
  @UseGuards(CustomerAuthGuard)
  @ApiOperation({
    summary: '예약 생성 (고객용)',
    description: '새로운 예약을 생성한다. 해당 식당의 다른 예약과 시간이 겹치면 안 된다.',
  })
  @ApiResponse({ status: 201, description: '예약 생성 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '고객 권한 필요', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '식당 또는 메뉴 없음', type: ErrorResponseDto })
  @ApiResponse({ status: 409, description: '예약 시간 중복', type: ErrorResponseDto })
  async createReservation(
    @Request() req: { user: JwtPayload },
    @Body() createForm: CreateReservationForm,
  ): Promise<ReservationResponseDto> {
    return await this.reservationService.createReservation(req.user, createForm);
  }

  /**
   * 예약 목록 조회 (고객용)
   */
  @Get('customer')
  @UseGuards(CustomerAuthGuard)
  @ApiOperation({
    summary: '예약 목록 조회 (고객용)',
    description: '로그인한 고객의 예약 목록을 조회한다. 필터링 옵션을 제공한다.',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: '전화번호 부분 검색',
    example: '010-1234',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: '예약 날짜 (YYYY-MM-DD)',
    example: '2025-07-07',
  })
  @ApiQuery({
    name: 'minGuestCount',
    required: false,
    description: '최소 인원수',
    example: 4,
    type: Number,
  })
  @ApiQuery({
    name: 'menuName',
    required: false,
    description: '포함 메뉴 이름 검색',
    example: '짬뽕',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '고객 권한 필요', type: ErrorResponseDto })
  async getCustomerReservations(
    @Request() req: { user: JwtPayload },
    @Query() filters: ReservationFilterForm,
  ): Promise<ReservationResponseDto[]> {
    return await this.reservationService.getReservations(req.user, filters);
  }

  /**
   * 예약 목록 조회 (식당용)
   */
  @Get('restaurant')
  @UseGuards(RestaurantAuthGuard)
  @ApiOperation({
    summary: '예약 목록 조회 (식당용)',
    description: '로그인한 식당의 예약 목록을 조회한다. 필터링 옵션을 제공한다.',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    description: '전화번호 부분 검색',
    example: '010-1234',
  })
  @ApiQuery({
    name: 'date',
    required: false,
    description: '예약 날짜 (YYYY-MM-DD)',
    example: '2025-07-07',
  })
  @ApiQuery({
    name: 'minGuestCount',
    required: false,
    description: '최소 인원수',
    example: 4,
    type: Number,
  })
  @ApiQuery({
    name: 'menuName',
    required: false,
    description: '포함 메뉴 이름 검색',
    example: '짬뽕',
  })
  @ApiResponse({ status: 200, description: '조회 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '식당 권한 필요', type: ErrorResponseDto })
  async getRestaurantReservations(
    @Request() req: { user: JwtPayload },
    @Query() filters: ReservationFilterForm,
  ): Promise<SuccessResponseDto<ReservationResponseDto[]>> {
    const result = await this.reservationService.getReservations(req.user, filters);
    return ResponseUtil.created(result, RESPONSE_MESSAGES.RESERVATION_CREATED);
  }

  /**
   * 예약 수정 (고객용)
   */
  @Put(':id')
  @UseGuards(CustomerAuthGuard)
  @ApiOperation({
    summary: '예약 수정 (고객용)',
    description: '예약의 인원수와 메뉴를 수정한다. 본인이 생성한 예약만 수정 가능하다.',
  })
  @ApiParam({
    name: 'id',
    description: '수정할 예약 ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: '수정 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 요청', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '본인 예약 아님', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '예약 없음', type: ErrorResponseDto })
  async updateReservation(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateForm: UpdateReservationForm,
  ): Promise<SuccessResponseDto<ReservationResponseDto>> {
    const result = await this.reservationService.updateReservation(req.user, id, updateForm);
    return ResponseUtil.success(result, RESPONSE_MESSAGES.RESERVATION_UPDATED);
  }

  /**
   * 예약 취소 (고객용)
   */
  @Delete(':id')
  @UseGuards(CustomerAuthGuard)
  @ApiOperation({
    summary: '예약 취소 (고객용)',
    description: '예약을 취소한다. 본인이 생성한 예약만 취소 가능하다.',
  })
  @ApiParam({
    name: 'id',
    description: '취소할 예약 ID',
    example: 1,
  })
  @ApiResponse({ status: 200, description: '취소 성공', type: SuccessResponseDto })
  @ApiResponse({ status: 400, description: '잘못된 ID', type: ErrorResponseDto })
  @ApiResponse({ status: 401, description: '인증 실패', type: ErrorResponseDto })
  @ApiResponse({ status: 403, description: '본인 예약 아님', type: ErrorResponseDto })
  @ApiResponse({ status: 404, description: '예약 없음', type: ErrorResponseDto })
  async deleteReservation(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessResponseDto> {
    await this.reservationService.deleteReservation(req.user, id);
    return ResponseUtil.deleted(RESPONSE_MESSAGES.RESERVATION_CANCELLED);
  }
}
