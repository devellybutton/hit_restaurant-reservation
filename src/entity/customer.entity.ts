import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';

/**
 * 고객 엔티티
 * 고객의 로그인 정보를 저장
 */
@Entity('customers')
export class Customer {
  /** 고객 고유 ID */
  @PrimaryGeneratedColumn()
  id: number;

  /** 로그인 ID */
  @Column({ unique: true })
  loginId: string;

  /** 로그인 비밀번호 */
  @Column()
  password: string;

  /** 고객의 예약 목록 */
  @OneToMany(() => Reservation, (reservation) => reservation.customer)
  reservations: Reservation[];

  /** 가입 일시 */
  @CreateDateColumn()
  createdAt: Date;

  /** 정보 변경 일시 */
  @UpdateDateColumn()
  updatedAt: Date;

  /** 탈퇴 일시 */
  @DeleteDateColumn()
  deletedAt: Date;
}
