import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  Type,
  mixin,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { RedisService } from '../../redis/redis.service';

export interface CacheOptions {
  ttlSeconds?: number;
  keyPrefix?: string;
}

export function RedisCache(options: CacheOptions = {}): Type<NestInterceptor> {
  @Injectable()
  class RedisCacheInterceptor implements NestInterceptor {
    constructor(private readonly redis: RedisService) {}

    async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
      const req = ctx.switchToHttp().getRequest();
      const res = ctx.switchToHttp().getResponse();

      const method = req.method;
      const url = req.originalUrl || req.url;
      const keyPrefix = options.keyPrefix ?? 'http';
      const cacheKey = `${keyPrefix}:${method}:${url}`;

      const client = this.redis.getClient();
      const cached = await client.get(cacheKey);

      if (cached) {
        res.setHeader('x-cache', 'HIT');
        return of(JSON.parse(cached));
      }

      res.setHeader('x-cache', 'MISS');
      const ttl = options.ttlSeconds ?? 60;

      return next.handle().pipe(
        tap(async (data) => {
          try {
            await client.set(cacheKey, JSON.stringify(data), 'EX', ttl);
          } catch {
           
          }
        }),
      );
    }
  }

  return mixin(RedisCacheInterceptor);
}
