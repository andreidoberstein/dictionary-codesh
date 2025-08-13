import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/user.module';
import { WordsModule } from './words/words.module';
import { DictionaryModule } from './dictionary/dictionary.module';

@Module({
  imports: [
    AuthModule, 
    UsersModule,
    WordsModule,
    DictionaryModule
  ],
  providers: [PrismaService],
})
export class AppModule {}
