import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from 'src/auth/dtos';
import { Customer } from 'src/entity/customer.entity';
import { Menu } from 'src/entity/menu.entity';
import { Reservation } from 'src/entity/reservation.entity';
import { Restaurant } from 'src/entity/restaurant.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateReservationForm, ReservationFilterForm, UpdateReservationForm } from './forms';
import { ReservationResponseDto } from './dtos';

/**
 * 예약 서비스
 * 예약 CRUD 기능 제공
 */
@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
  ) {}

  /**
   * 예약 생성
   * @param user 로그인한 고객 정보
   * @param createForm 예약 생성 데이터
   * @returns 생성된 예약
   */
  async createReservation(
    user: JwtPayload,
    createForm: CreateReservationForm,
  ): Promise<ReservationResponseDto> {
    const startTime = new Date(createForm.startTime);
    const endTime = new Date(createForm.endTime);

    // 시간 유효성 검증
    this.validateTimeRange(startTime, endTime);

    // 엔티티 존재 확인
    const [customer, restaurant, menus] = await Promise.all([
      this.findCustomerById(user.id),
      this.findRestaurantById(createForm.restaurantId),
      this.findMenusByIds(createForm.menuIds, createForm.restaurantId),
    ]);

    // 시간 겹침 검증
    await this.validateTimeConflict(createForm.restaurantId, startTime, endTime);

    // 예약 생성
    const reservation = this.reservationRepository.create({
      guestCount: createForm.guestCount,
      startTime,
      endTime,
      phone: createForm.phone,
      customer,
      restaurant,
      menus,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    // 관계 데이터와 함께 다시 조회
    const reservationWithRelations = await this.findReservationWithRelations(savedReservation.id);
    return this.mapToResponseDto(reservationWithRelations);
  }

  /**
   * 예약 목록 조회
   * @param user 로그인한 사용자 정보
   * @param filters 필터 조건
   * @returns 예약 목록
   */
  async getReservations(
    user: JwtPayload,
    filters: ReservationFilterForm,
  ): Promise<ReservationResponseDto[]> {
    const queryBuilder = this.createReservationQueryBuilder();

    // 사용자 타입에 따른 필터링
    if (user.type === 'customer') {
      queryBuilder.where('customer.id = :customerId', { customerId: user.id });
    } else if (user.type === 'restaurant') {
      queryBuilder.where('restaurant.id = :restaurantId', { restaurantId: user.id });
    }

    this.applyFilters(queryBuilder, filters);

    const reservations = await queryBuilder.getMany();
    return reservations.map((reservation) => this.mapToResponseDto(reservation));
  }

  /**
   * 예약 수정
   * @param user 로그인한 고객 정보
   * @param reservationId 예약 ID
   * @param updateForm 수정 데이터
   * @returns 수정된 예약
   */
  async updateReservation(
    user: JwtPayload,
    reservationId: number,
    updateForm: UpdateReservationForm,
  ): Promise<ReservationResponseDto> {
    const reservation = await this.findReservationWithRelations(reservationId);

    // 본인 예약인지 확인
    if (reservation.customer.id !== user.id) {
      throw new ForbiddenException('본인이 생성한 예약만 수정할 수 있습니다.');
    }

    // 인원수 수정
    if (updateForm.guestCount !== undefined) {
      reservation.guestCount = updateForm.guestCount;
    }

    // 메뉴 수정
    if (updateForm.menuIds) {
      const menus = await this.findMenusByIds(updateForm.menuIds, reservation.restaurant.id);
      reservation.menus = menus;
    }

    const updatedReservation = await this.reservationRepository.save(reservation);
    const reservationWithRelations = await this.findReservationWithRelations(updatedReservation.id);
    return this.mapToResponseDto(reservationWithRelations);
  }

  /**
   * 예약 삭제
   * @param user 로그인한 고객 정보
   * @param reservationId 예약 ID
   */
  async deleteReservation(user: JwtPayload, reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['customer'],
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    // 본인 예약인지 확인
    if (reservation.customer.id !== user.id) {
      throw new ForbiddenException('본인이 생성한 예약만 취소할 수 있습니다.');
    }

    await this.reservationRepository.softDelete(reservationId);
  }

  /**
   * 시간 유효성 검증
   */
  private validateTimeRange(startTime: Date, endTime: Date): void {
    const now = new Date();

    if (startTime <= now) {
      throw new BadRequestException('예약 시간은 현재 시간보다 이후여야 합니다.');
    }

    if (endTime <= startTime) {
      throw new BadRequestException('종료 시간은 시작 시간보다 이후여야 합니다.');
    }

    const timeDifference = endTime.getTime() - startTime.getTime();
    const minDuration = 30 * 60 * 1000; // 30분
    const maxDuration = 4 * 60 * 60 * 1000; // 4시간

    if (timeDifference < minDuration) {
      throw new BadRequestException('예약 시간은 최소 30분 이상이어야 합니다.');
    }

    if (timeDifference > maxDuration) {
      throw new BadRequestException('예약 시간은 최대 4시간까지 가능합니다.');
    }
  }

  /**
   * 시간 겹침 검증
   */
  private async validateTimeConflict(
    restaurantId: number,
    startTime: Date,
    endTime: Date,
    excludeReservationId?: number,
  ): Promise<void> {
    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .where('reservation.restaurant.id = :restaurantId', { restaurantId })
      .andWhere('(reservation.startTime < :endTime AND reservation.endTime > :startTime)', {
        startTime,
        endTime,
      });

    if (excludeReservationId) {
      queryBuilder.andWhere('reservation.id != :excludeReservationId', {
        excludeReservationId,
      });
    }

    const conflictingReservation = await queryBuilder.getOne();

    if (conflictingReservation) {
      throw new ConflictException('해당 시간에 이미 다른 예약이 있습니다.');
    }
  }

  /**
   * 고객 조회
   */
  private async findCustomerById(customerId: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('고객 정보를 찾을 수 없습니다.');
    }

    return customer;
  }

  /**
   * 식당 조회
   */
  private async findRestaurantById(restaurantId: number): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: restaurantId },
    });

    if (!restaurant) {
      throw new NotFoundException('식당 정보를 찾을 수 없습니다.');
    }

    return restaurant;
  }

  /**
   * 메뉴 조회 및 검증
   */
  private async findMenusByIds(menuIds: number[], restaurantId: number): Promise<Menu[]> {
    const menus = await this.menuRepository.find({
      where: {
        id: menuIds.length === 1 ? menuIds[0] : undefined,
        restaurant: { id: restaurantId },
      },
      relations: ['restaurant'],
    });

    if (menuIds.length > 1) {
      const foundMenus = await this.menuRepository
        .createQueryBuilder('menu')
        .where('menu.id IN (:...menuIds)', { menuIds })
        .andWhere('menu.restaurant.id = :restaurantId', { restaurantId })
        .leftJoinAndSelect('menu.restaurant', 'restaurant')
        .getMany();

      if (foundMenus.length !== menuIds.length) {
        throw new NotFoundException('일부 메뉴를 찾을 수 없거나 해당 식당의 메뉴가 아닙니다.');
      }

      return foundMenus;
    }

    if (menus.length !== menuIds.length) {
      throw new NotFoundException('일부 메뉴를 찾을 수 없거나 해당 식당의 메뉴가 아닙니다.');
    }

    return menus;
  }

  /**
   * 관계가 포함된 예약 조회
   */
  private async findReservationWithRelations(reservationId: number): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({
      where: { id: reservationId },
      relations: ['customer', 'restaurant', 'menus'],
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    return reservation;
  }

  /**
   * 예약 조회용 쿼리 빌더 생성
   */
  private createReservationQueryBuilder(): SelectQueryBuilder<Reservation> {
    return this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.customer', 'customer')
      .leftJoinAndSelect('reservation.restaurant', 'restaurant')
      .leftJoinAndSelect('reservation.menus', 'menus')
      .orderBy('reservation.startTime', 'DESC');
  }

  /**
   * 필터 조건 적용
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Reservation>,
    filters: ReservationFilterForm,
  ): void {
    if (filters.phone) {
      queryBuilder.andWhere('reservation.phone LIKE :phone', {
        phone: `%${filters.phone}%`,
      });
    }

    if (filters.date) {
      const date = new Date(filters.date);
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      queryBuilder.andWhere('reservation.startTime >= :startDate', { startDate: date });
      queryBuilder.andWhere('reservation.startTime < :endDate', { endDate: nextDate });
    }

    if (filters.minGuestCount !== undefined) {
      queryBuilder.andWhere('reservation.guestCount >= :minGuestCount', {
        minGuestCount: filters.minGuestCount,
      });
    }

    if (filters.menuName) {
      queryBuilder.andWhere('menus.name LIKE :menuName', {
        menuName: `%${filters.menuName}%`,
      });
    }
  }

  /**
   * 엔티티를 응답 DTO로 변환
   */
  private mapToResponseDto(reservation: Reservation): ReservationResponseDto {
    const totalAmount = reservation.menus.reduce((sum, menu) => sum + Number(menu.price), 0);

    return {
      id: reservation.id,
      guestCount: reservation.guestCount,
      startTime: reservation.startTime,
      endTime: reservation.endTime,
      phone: reservation.phone,
      restaurant: {
        id: reservation.restaurant.id,
        name: reservation.restaurant.name,
        phone: reservation.restaurant.phone,
      },
      customer: {
        id: reservation.customer.id,
        loginId: reservation.customer.loginId,
      },
      menus: reservation.menus.map((menu) => ({
        id: menu.id,
        name: menu.name,
        price: Number(menu.price),
        category: menu.category,
      })),
      totalAmount,
      createdAt: reservation.createdAt,
      updatedAt: reservation.updatedAt,
    };
  }
}
