import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ResponseUtil } from 'src/util/responses';

/**
 * 모든 예외를 전역적으로 처리하는 필터
 * HttpException 또는 기타 예외를 잡아 표준화된 에러 응답 형식으로 변환
 * (responses.ts에 공통 응답 양식 통일)
 *
 * @param exception - 발생한 예외 객체
 * @param host - 현재 처리 중인 요청의 ArgumentsHost
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = '서버 오류가 발생했습니다.';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse();

      if (typeof response === 'string') {
        message = response;
      } else if (typeof response === 'object' && response !== null) {
        const obj = response as any;
        message = obj.message ?? message;
        error = obj.error ?? HttpStatus[status];
      }
    }

    res.status(status).json(ResponseUtil.error(message, status, error));
  }
}
