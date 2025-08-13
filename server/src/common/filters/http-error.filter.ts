import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const message = exception.message || 'Ocorreu um erro.';
      return response.status(status).json({ message });
    }

    return response.status(HttpStatus.BAD_REQUEST).json({
      message: 'Ocorreu um erro ao processar a requisição.',
    });
  }
}
