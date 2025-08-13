import { Injectable, NestInterceptor, ExecutionContext, CallHandler, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data === null || data === undefined || (Array.isArray(data) && data.length === 0)) {
          response.status(HttpStatus.NO_CONTENT);
          return null;
        }

        response.status(HttpStatus.OK);
        return data;
      }),
    );
  }
}
