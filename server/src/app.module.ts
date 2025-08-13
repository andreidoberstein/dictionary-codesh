import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { WordsModule } from './words/words.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    WordsModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
