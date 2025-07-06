import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { Repository } from 'typeorm';
import { Restaurant } from './../entity/restaurant.entity';
import { CustomerLoginForm, RestaurantLoginForm } from './forms';
import { JwtPayload, LoginResponseDto } from './dtos';
import * as bcrypt from 'bcrypt';

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
   * 고객 로그인
   * @param loginForm - 고객 계정 로그인 입력 정보 (아이디, 비밀번호)
   * @returns JWT 액세스 토큰
   * @throws {UnauthorizedException} 로그인 실패 시 (존재하지 않는 계정, 비밀번호 불일치)
   */
  async customerLogin(loginForm: CustomerLoginForm): Promise<LoginResponseDto> {
    const { loginId, password } = loginForm;
    const customer = await this.customerRepository.findOne({
      where: { loginId },
    });

    if (!customer) throw new UnauthorizedException('고객 계정이 아닙니다.');

    const isPasswordValid = await bcrypt.compare(password, customer.password);

    if (!isPasswordValid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return this.generateAccessToken({
      id: customer.id,
      loginId: customer.loginId,
      type: 'customer',
    });
  }

  /**
   * 식당 로그인
   * @param loginForm - 식당 계정 로그인 입력 정보 (아이디, 비밀번호)
   * @returns JWT 액세스 토큰
   * @throws {UnauthorizedException} 로그인 실패 시 (존재하지 않는 계정, 비밀번호 불일치)
   */
  async restaurantLogin(loginForm: RestaurantLoginForm): Promise<LoginResponseDto> {
    const { loginId, password } = loginForm;
    const restaurant = await this.restaurantRepository.findOne({
      where: { loginId },
    });

    if (!restaurant) throw new UnauthorizedException('식당 계정이 아닙니다.');

    const isPasswordValid = await bcrypt.compare(password, restaurant.password);

    if (!isPasswordValid) throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');

    return this.generateAccessToken({
      id: restaurant.id,
      loginId: restaurant.loginId,
      type: 'customer',
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
    const expiresIn = this.configService.get<string>('JWT_EXPIRES_IN') ?? '2h';

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
