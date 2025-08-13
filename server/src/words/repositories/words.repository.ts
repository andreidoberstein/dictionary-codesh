import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class WordsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async upsertMany(words: string[]) {
    const operations = words.map(word =>
      this.prisma.word.upsert({
        where: { text: word },
        update: {},
        create: { text: word },
      }),
    );

    await this.prisma.$transaction(operations);
  }

  async create(word: string) {
    return this.prisma.word.create({
      data: { text: word },
    });
  }
}
