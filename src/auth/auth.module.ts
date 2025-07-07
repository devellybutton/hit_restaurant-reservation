import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from './config/jwt.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from 'src/entity/customer.entity';
import { Restaurant } from 'src/entity/restaurant.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CustomerAuthGuard } from './guards/customer-auth.guard';
import { RestaurantAuthGuard } from './guards/restaurant-auth.guard';

/**
 * 인증 모듈
 * JWT 인증, 로그인 서비스, 가드 등을 제공
 */
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Customer, Restaurant]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, CustomerAuthGuard, RestaurantAuthGuard],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
