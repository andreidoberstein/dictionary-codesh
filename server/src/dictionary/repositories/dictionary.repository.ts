import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DictionaryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, cursor?: string, limitParam?: number) {
    const where = search
      ? { text: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const totalDocs = await this.prisma.word.count({ where });

    const baseOptions: any = {
      where,
      select: { id: true, text: true },
      orderBy: [{ text: 'asc' }, { id: 'asc' }],
    };

    const decodedCursor = cursor
      ? JSON.parse(Buffer.from(cursor, 'base64').toString('ascii')) as {id: number}
      : null;

    if (search) {
      const limit = Math.max(limitParam || 10, 1);
      
      const queryOptions: any = {
        ...baseOptions,
        take: limit + 1, // +1 para detectar hasNext
      };

      if (decodedCursor) {
        queryOptions.cursor = { id: decodedCursor.id };
        queryOptions.skip = 1;
      }
      
      const words = await this.prisma.word.findMany(queryOptions);

      let hasNext = false;
      if (words.length > limit) {
        hasNext = true;
        words.pop(); // limita ao 'limit'
      }

      const nextCursor = hasNext
        ? Buffer.from(JSON.stringify({ id: words[words.length - 1].id })).toString('base64')
        : null;

      const hasPrev = !!decodedCursor;
      const prevCursor = hasPrev
          ? Buffer.from(JSON.stringify({ id: words[0].id })).toString('base64')
          : null;

      return {
        results: words.map((w) => w.text),
        totalDocs,
        previous: prevCursor,
        next: nextCursor,
        hasNext,
        hasPrev,
      };
    }

    const words = await this.prisma.word.findMany(baseOptions);
    return {
      results: words.map((w) => w.text),
      totalDocs,
      previous: null,
      next: null,
      hasNext: false,
      hasPrev: false,
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

  async registerHistory(word: string, userId: string) {
    const entry = await this.prisma.word.findUnique({
      where: { text: word },
      select: { id: true },
    });

    if (!entry) return;
    
    const d = await this.prisma.wordHistories.create({
      data: {
        userId: userId,
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