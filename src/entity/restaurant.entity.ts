import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { Menu } from './menu.entity';
import { Reservation } from './reservation.entity';

/**
 * 식당 엔티티
 * 식당의 기본 정보와 로그인 정보를 저장
 */
@Entity('restaurants')
export class Restaurant {
  /** 식당 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 식당 이름 */
  @Column({ length: 200 })
  name: string;

  /** 로그인 ID */
  @Column({ unique: true })
  loginId: string;

  /** 로그인 비밀번호 */
  @Column()
  password: string;

  /** 식당 전화번호 */
  @Column({ length: 20 })
  phone: string;

  /** 해당 식당의 메뉴 목록 */
  @OneToMany(() => Menu, (menu) => menu.restaurant)
  menus: Menu[];

  /** 해당 식당의 예약 목록 */
  @OneToMany(() => Reservation, (reservation) => reservation.restaurant)
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
