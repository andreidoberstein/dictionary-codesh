import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const res = ctx.switchToHttp().getResponse();

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        res.setHeader('x-response-time', String(ms));
        if (!res.getHeader('x-cache')) {
          res.setHeader('x-cache', 'MISS');
        }
      }),
    );
  }
}
