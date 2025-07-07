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
  @ApiResponse({
    status: 201,
    description: '예약 생성 성공',
    type: ReservationResponseDto,
    example: {
      id: 1,
      guestCount: 4,
      startTime: '2025-07-07T19:00:00.000Z',
      endTime: '2025-07-07T21:00:00.000Z',
      phone: '010-1234-5678',
      restaurant: {
        id: 1,
        name: '맛있는 한식당',
        phone: '02-1234-5678',
      },
      customer: {
        id: 1,
        loginId: 'customer01',
      },
      menus: [
        {
          id: 1,
          name: '짬뽕',
          price: 8000,
          category: '중식',
        },
      ],
      totalAmount: 8000,
      createdAt: '2025-07-06T18:00:00.000Z',
      updatedAt: '2025-07-06T18:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 - 시간 유효성 검증 실패',
    example: {
      statusCode: 400,
      message: '예약 시간은 현재 시간보다 이후여야 합니다.',
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 고객 권한 필요',
  })
  @ApiResponse({
    status: 404,
    description: '식당 또는 메뉴를 찾을 수 없음',
  })
  @ApiResponse({
    status: 409,
    description: '시간 겹침 - 해당 시간에 이미 다른 예약이 있음',
    example: {
      statusCode: 409,
      message: '해당 시간에 이미 다른 예약이 있습니다.',
      error: 'Conflict',
    },
  })
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
  @ApiResponse({
    status: 200,
    description: '예약 목록 조회 성공',
    type: [ReservationResponseDto],
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 고객 권한 필요',
  })
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
  @ApiResponse({
    status: 200,
    description: '예약 목록 조회 성공',
    type: [ReservationResponseDto],
    example: [
      {
        id: 1,
        guestCount: 4,
        startTime: '2025-07-07T19:00:00.000Z',
        endTime: '2025-07-07T21:00:00.000Z',
        phone: '010-1234-5678',
        restaurant: {
          id: 1,
          name: '맛있는 한식당',
          phone: '02-1234-5678',
        },
        customer: {
          id: 1,
          loginId: 'customer01',
        },
        menus: [
          {
            id: 1,
            name: '짬뽕',
            price: 8000,
            category: '중식',
          },
        ],
        totalAmount: 8000,
        createdAt: '2025-07-06T18:00:00.000Z',
        updatedAt: '2025-07-06T18:00:00.000Z',
      },
    ],
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 식당 권한 필요',
  })
  async getRestaurantReservations(
    @Request() req: { user: JwtPayload },
    @Query() filters: ReservationFilterForm,
  ): Promise<ReservationResponseDto[]> {
    return await this.reservationService.getReservations(req.user, filters);
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
  @ApiResponse({
    status: 200,
    description: '예약 수정 성공',
    type: ReservationResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 본인 예약만 수정 가능',
    example: {
      statusCode: 403,
      message: '본인이 생성한 예약만 수정할 수 있습니다.',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없음',
  })
  async updateReservation(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
    @Body() updateForm: UpdateReservationForm,
  ): Promise<ReservationResponseDto> {
    return await this.reservationService.updateReservation(req.user, id, updateForm);
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
  @ApiResponse({
    status: 200,
    description: '예약 취소 성공',
    example: {
      message: '예약이 성공적으로 취소되었습니다.',
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 예약 ID',
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  @ApiResponse({
    status: 403,
    description: '권한 없음 - 본인 예약만 취소 가능',
    example: {
      statusCode: 403,
      message: '본인이 생성한 예약만 취소할 수 있습니다.',
      error: 'Forbidden',
    },
  })
  @ApiResponse({
    status: 404,
    description: '예약을 찾을 수 없음',
  })
  async deleteReservation(
    @Request() req: { user: JwtPayload },
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.reservationService.deleteReservation(req.user, id);
    return { message: '예약이 성공적으로 취소되었습니다.' };
  }
}
