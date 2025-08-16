import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DictionaryController } from './constroller/dictionary.controller';
import { DictionaryService } from './services/dictionary.service';
import { DictionaryRepository } from './repositories/dictionary.repository';
import { HttpModule, HttpService } from '@nestjs/axios';
import { UsersService } from 'src/users/services/user.service';

@Module({
  imports: [HttpModule],
  controllers: [DictionaryController],
  providers: [DictionaryService, DictionaryRepository, PrismaService, UsersService],
})
export class DictionaryModule {}
