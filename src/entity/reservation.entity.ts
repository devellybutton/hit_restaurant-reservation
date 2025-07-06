import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Restaurant } from './restaurant.entity';
import { Customer } from './customer.entity';
import { Menu } from './menu.entity';

/**
 * 예약 엔티티
 * 고객의 식당 예약 정보를 저장
 */
@Entity('reservations')
export class Reservation {
  /** 예약 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 예약 인원수 */
  @Column()
  guestCount: number;

  /** 예약 시작 시간 (날짜 + 시각) */
  @Column({ type: 'datetime' })
  startTime: Date;

  /** 예약 종료 시간 (날짜 + 시각) */
  @Column({ type: 'datetime' })
  endTime: Date;

  /** 예약자 전화번호 */
  @Column({ length: 20 })
  phone: string;

  /** 예약한 식당 (식당 삭제 시 예약도 삭제) */
  @ManyToOne(() => Restaurant, (restaurant) => restaurant.reservations, { onDelete: 'CASCADE' })
  restaurant: Restaurant;

  /** 예약한 고객 (고객 삭제 시 예약도 삭제) */
  @ManyToOne(() => Customer, (customer) => customer.reservations, { onDelete: 'CASCADE' })
  customer: Customer;

  /** 예약에 포함된 메뉴 목록 (다대다 관계) */
  @ManyToMany(() => Menu, (menu) => menu.reservations)
  @JoinTable({
    name: 'reservation_menus',
    joinColumn: { name: 'reservation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'menu_id', referencedColumnName: 'id' },
  })
  menus: Menu[];

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
