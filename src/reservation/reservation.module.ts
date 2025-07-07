import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Customer } from 'src/entity/customer.entity';
import { Menu } from 'src/entity/menu.entity';
import { Reservation } from 'src/entity/reservation.entity';
import { Restaurant } from 'src/entity/restaurant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Customer, Restaurant, Menu]), AuthModule],
  providers: [ReservationService],
  controllers: [ReservationController],
  exports: [ReservationService],
})
export class ReservationModule {}
