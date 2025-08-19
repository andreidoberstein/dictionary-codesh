import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { WordsModule } from './words/words.module';
import { DictionaryModule } from './dictionary/dictionary.module';
import { AppController } from './app.controller';
import { RedisModule } from './redis/redis.module';
import { HealthController } from './health.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          url: process.env.REDIS_URL, 
        }),
      }),
    }),
    AuthModule, 
    UsersModule,
    WordsModule,
    DictionaryModule,
    RedisModule
  ],
  controllers: [
    AppController,
    HealthController
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
