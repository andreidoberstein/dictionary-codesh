import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DictionaryController } from './constroller/dictionary.controller';
import { DictionaryService } from './services/dictionary.service';
import { DictionaryRepository } from './repositories/dictionary.repository';

@Module({
  controllers: [DictionaryController],
  providers: [DictionaryService, DictionaryRepository, PrismaService],
})
export class DictionaryModule {}
