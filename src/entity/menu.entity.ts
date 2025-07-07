import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Restaurant } from './restaurant.entity';

/**
 * 메뉴 카테고리 enum (양식, 일식, 중식)
 */
export enum MenuCategory {
  WESTERN = 'western',
  JAPANESE = 'japanese',
  CHINESE = 'chinese',
}

/**
 * 메뉴 엔티티
 * 식당의 메뉴 정보를 저장
 */
@Entity('menus')
export class Menu {
  /** 메뉴 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 메뉴 이름 */
  @Column({ length: 200 })
  name: string;

  /** 메뉴 가격 */
  @Column({ type: 'int', unsigned: true })
  price: number;

  /** 메뉴 카테고리 (양식, 일식, 중식) */
  @Column({
    type: 'enum',
    enum: MenuCategory,
  })
  category: MenuCategory;

  /** 메뉴 설명 */
  @Column('text')
  description: string;

  /** 소속 식당 (식당 삭제 시 메뉴도 삭제) */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.menus, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  /** 이 메뉴가 포함된 예약 목록 */
  @ManyToMany(() => Reservation, (reservation) => reservation.menus)
  reservations: Reservation[];

  /** 생성 일시 */
  @CreateDateColumn()
  createdAt: Date;

  /** 수정 일시 */
  @UpdateDateColumn()
  updatedAt: Date;

  /** 삭제 일시 */
  @DeleteDateColumn()
  deletedAt: Date;
}
