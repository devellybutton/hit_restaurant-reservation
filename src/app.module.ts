import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CustomerModule } from './customer/customer.module';
import { MenuController } from './menu/menu.controller';
import { MenuModule } from './menu/menu.module';
import { ReservationModule } from './reservation/reservation.module';
import { RestaurantModule } from './restaurant/restaurant.module';

@Module({
  imports: [AuthModule, CustomerModule, MenuModule, ReservationModule, RestaurantModule],
  controllers: [AppController, MenuController],
  providers: [AppService],
})
export class AppModule {}
