import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DictionaryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(search: string, pageParam: number, limitParam: number) {
    const page = Math.max(pageParam || 1, 1);
    const limit = Math.max(limitParam || 10, 1);

    const where = search
      ? { text: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const totalDocs = await this.prisma.word.count({ where });

    const words = await this.prisma.word.findMany({
      where,
      select: { text: true },
      orderBy: { text: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(totalDocs / limit);

    return {
      results: words.map((w) => w.text),
      totalDocs,
      page,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  async findByWord(word: string) {
    return this.prisma.word.findUnique({
      where: { text: word },
      select: {
        id: true,
        text: true,
        createdAt: true,
      }
    });
  }

  async registerHistory(word: string) {
    const entry = await this.prisma.word.findUnique({
      where: { text: word },
      select: { id: true },
    });

    if (!entry) return;

    await this.prisma.wordHistories.create({
      data: {
        wordId: entry.id,
        accessedAt: new Date(),
      }
    });
  }

  async addFavorite(userId: string, word: string) {
    await this.prisma.favorite.upsert({
      where: {
        userId_word: { userId, word },
      },
      update: {}, 
      create: {
        userId,
        word,
      },
    });
  }

  async unfavoriteWord(userId: string, word: string): Promise<void> {
    const favorite = await this.prisma.favorite.findFirst({
      where: { userId, word },
    });

    if (!favorite) {
      throw new NotFoundException(`A palavra "${word}" não está nos favoritos`);
    }

    await this.prisma.favorite.delete({
      where: { id: favorite.id },
    });
  }
}