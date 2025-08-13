import { Module } from '@nestjs/common';
import { WordsRepository } from './repositories/words.repository';
import { PrismaService } from '../prisma/prisma.service';
import { WordsService } from './service/words.service';

@Module({
  providers: [WordsService, WordsRepository, PrismaService],
  exports: [WordsService],
})
export class WordsModule {}
