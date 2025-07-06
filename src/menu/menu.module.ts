import { Module } from '@nestjs/common';
import { MenuService } from './menu.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Menu } from 'src/entity/menu.entity';
import { Restaurant } from 'src/entity/restaurant.entity';
import { MenuController } from './menu.controller';

/**
 * 메뉴 모듈
 * 식당 계정의 메뉴 관리 기능 제공
 */
@Module({
  imports: [TypeOrmModule.forFeature([Menu, Restaurant]), AuthModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService],
})
export class MenuModule {}
