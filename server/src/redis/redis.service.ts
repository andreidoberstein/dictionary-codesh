import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL + "?family=0" || 'redis://localhost:6379', {
    });
  }

  getClient() {
    return this.client;
  }

  async onModuleDestroy() {
    await this.client.quit();
  }
}
