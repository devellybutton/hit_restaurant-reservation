import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from 'src/entity/menu.entity';
import { Restaurant } from 'src/entity/restaurant.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CreateMenuForm, MenuFilterForm } from './forms';
import { JwtPayload } from 'src/auth/dtos';
import { MenuResponseDto } from './dtos';
import { RESPONSE_MESSAGES } from 'src/util/responses';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private menuRepository: Repository<Menu>,
    @InjectRepository(Restaurant)
    private restaurantRepository: Repository<Restaurant>,
  ) {}

  /**
   * 메뉴 목록 조회 (필터링 가능)
   * @param user 로그인한 식당 정보
   * @param filters 필터 조건
   * @returns 메뉴 목록
   */
  async getMenus(user: JwtPayload, filters: MenuFilterForm): Promise<MenuResponseDto[]> {
    const queryBuilder = this.createMenuQueryBuilder().where('restaurant.id = :restaurantId', {
      restaurantId: user.id,
    });

    this.applyFilters(queryBuilder, filters);

    const menus = await queryBuilder.getMany();
    return this.mapToResponseDto(menus);
  }

  /**
   * 메뉴 생성
   * @param user 로그인한 식당 정보
   * @param createMenuForm 메뉴 생성시 입력하는 정보
   * @returns 생성된 메뉴
   */
  async createMenu(user: JwtPayload, createMenuForm: CreateMenuForm): Promise<MenuResponseDto> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id: user.id },
    });

    if (!restaurant) {
      throw new NotFoundException(RESPONSE_MESSAGES.RESTAURANT_NOT_FOUND);
    }

    const menu = this.menuRepository.create({
      ...createMenuForm,
      restaurant,
    });

    const savedMenu = await this.menuRepository.save(menu);

    const menuWithRestaurant = await this.menuRepository.findOne({
      where: { id: savedMenu.id },
      relations: ['restaurant'],
    });

    return this.mapToResponseDto([menuWithRestaurant!])[0];
  }

  /**
   * 메뉴 삭제
   * @param user 로그인한 식당 정보
   * @param menuId 삭제할 메뉴 ID
   */
  async deleteMenu(user: JwtPayload, menuId: number): Promise<void> {
    const menu = await this.menuRepository.findOne({
      where: { id: menuId },
      relations: ['restaurant'],
    });

    if (!menu) {
      throw new NotFoundException(RESPONSE_MESSAGES.MENU_NOT_FOUND);
    }

    if (menu.restaurant.id !== user.id) {
      throw new ForbiddenException(RESPONSE_MESSAGES.MENU_FORBIDDEN);
    }

    await this.menuRepository.softDelete(menuId);
  }

  /**
   * 메뉴 조회용 쿼리 빌더 생성
   * 메뉴와 식당 left join 후 최신순 정렬
   */
  private createMenuQueryBuilder(): SelectQueryBuilder<Menu> {
    return this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.restaurant', 'restaurant')
      .orderBy('menu.createdAt', 'DESC');
  }

  /**
   * 필터 조건 적용
   */
  private applyFilters(queryBuilder: SelectQueryBuilder<Menu>, filters: MenuFilterForm): void {
    if (filters.name) {
      queryBuilder.andWhere('menu.name LIKE :name', {
        name: `%${filters.name}%`,
      });
    }

    if (filters.minPrice !== undefined) {
      queryBuilder.andWhere('menu.price >= :minPrice', {
        minPrice: filters.minPrice,
      });
    }

    if (filters.maxPrice !== undefined) {
      queryBuilder.andWhere('menu.price <= :maxPrice', {
        maxPrice: filters.maxPrice,
      });
    }

    if (filters.category) {
      queryBuilder.andWhere('menu.category = :category', {
        category: filters.category,
      });
    }
  }

  /**
   * 엔티티를 응답 DTO로 변환
   */
  private mapToResponseDto(menus: Menu[]): MenuResponseDto[] {
    return menus.map((menu) => ({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      category: menu.category,
      description: menu.description,
      restaurantName: menu.restaurant.name,
      createdAt: menu.createdAt,
      updatedAt: menu.updatedAt,
    }));
  }
}
