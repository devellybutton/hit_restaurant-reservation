import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  /**
   * MySQL 쿼리를 실행해 DB 연결 상태를 확인하고,
   * 서버 응답 여부와 함께 MySQL 연결 상태가 반환된다.
   *
   * @returns 서버 및 DB 상태 객체
   * ```ts
   * {
   *   server: 'ok',
   *   mysql: 'ok' | 'fail'
   * }
   * ```
   */
  async getHealth() {
    const health: Record<string, 'ok' | 'fail'> = { server: 'ok' };

    try {
      await this.dataSource.query('SELECT 1');
      health.mysql = 'ok';
    } catch {
      health.mysql = 'fail';
    }

    return health;
  }
}
