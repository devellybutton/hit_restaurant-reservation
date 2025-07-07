import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Restaurant } from './../entity/restaurant.entity';
import { CustomerLoginForm, RestaurantLoginForm } from './forms';
import { JwtPayload, LoginResponseDto } from './dtos';
import * as bcrypt from 'bcrypt';
import { UserType } from './enums';
import { RESPONSE_MESSAGES } from 'src/util/responses';

/**
 * 인증 서비스
 * 고객 및 식당 로그인 처리
 */
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  /**
   * 새 고객 생성
   */
  async createCustomer(customerData: { loginId: string; password: string }) {
    const hashedPassword = await this.hashPassword(customerData.password);

    const newCustomer = this.customerRepository.create({
      loginId: customerData.loginId,
      password: hashedPassword,
    });

    const savedCustomer = await this.customerRepository.save(newCustomer);

    return { id: savedCustomer.id, loginId: savedCustomer.loginId };
  }

  /**
   * 새 식당 생성
   */
  async createRestaurant(restaurantData: { loginId: string; password: string }) {
    const hashedPassword = await this.hashPassword(restaurantData.password);

    const newRestaurant = this.restaurantRepository.create({
      loginId: restaurantData.loginId,
      password: hashedPassword,
    });

    const savedRestaurant = await this.restaurantRepository.save(newRestaurant);

    return { id: savedRestaurant.id, loginId: savedRestaurant.loginId };
  }

  /**
   * 고객 로그인
   * @param loginForm - 고객 계정 로그인 입력 정보 (아이디, 비밀번호)
   * @returns JWT 액세스 토큰
   * @throws {UnauthorizedException} 로그인 실패 시 (존재하지 않는 계정, 비밀번호 불일치)
   */
  async customerLogin(loginForm: CustomerLoginForm): Promise<LoginResponseDto> {
    return this.validateAndLogin(this.customerRepository, loginForm, UserType.CUS);
  }

  /**
   * 식당 로그인
   * @param loginForm - 식당 계정 로그인 입력 정보 (아이디, 비밀번호)
   * @returns JWT 액세스 토큰
   * @throws {UnauthorizedException} 로그인 실패 시 (존재하지 않는 계정, 비밀번호 불일치)
   */
  async restaurantLogin(loginForm: RestaurantLoginForm): Promise<LoginResponseDto> {
    return this.validateAndLogin(this.restaurantRepository, loginForm, UserType.RES);
  }

  private async validateAndLogin<T extends { id: number; loginId: string; password: string }>(
    repository: Repository<T>,
    loginForm: { loginId: string; password: string },
    type: UserType,
  ): Promise<LoginResponseDto> {
    const user = await repository.findOne({
      where: { loginId: loginForm.loginId } as FindOptionsWhere<T>,
    });
    if (!user) throw new UnauthorizedException(RESPONSE_MESSAGES.UNAUTHORIZED);

    const isPasswordValid = await bcrypt.compare(loginForm.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException(RESPONSE_MESSAGES.PASSWORD_INVALID);

    return this.generateAccessToken({
      id: user.id,
      loginId: user.loginId,
      type,
    });
  }

  /**
   * JWT 액세스 토큰 생성
   *
   * @param payload - JWT에 담는 사용자 정보 (id, loginId, type(고객 혹은 식당))
   * @returns 액세스 토큰, 타입, 만료 시간
   */
  private generateAccessToken(payload: JwtPayload): LoginResponseDto {
    const accessToken = this.jwtService.sign(payload);
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '3h';

    return {
      accessToken,
      tokenType: 'Bearer',
      expiresIn,
    };
  }

  /**
   * 비밀번호 해싱 (더미 데이터 생성용)
   *
   * @param plainPassword - 평문 비밀번호
   * @returns 해시화된 비밀번호
   */
  async hashPassword(plainPassword: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainPassword, saltRounds);
  }
}
