import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /**
   * 서버 및 MySQL 연결 상태 확인 API
   * @returns `{ server: 'ok', mysql: 'ok' | 'fail' }`
   */
  @Get()
  @ApiOperation({ summary: '헬스 체크 API (서버 및 MySQL)' })
  @ApiResponse({
    status: 200,
    description: '서버 및 MySQL 연결 상태를 반환한다.',
    schema: {
      example: {
        server: 'ok',
        mysql: 'ok',
      },
    },
  })
  async getHealth(): Promise<Record<string, 'ok' | 'fail'>> {
    return this.appService.getHealth();
  }
}
