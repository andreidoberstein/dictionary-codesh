import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class DictionaryRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(search?: string, cursor?: string, limitParam?: number) {
    const limit = search ? Math.max(limitParam || 10, 1) : undefined;

    const where = search
      ? { text: { contains: search, mode: Prisma.QueryMode.insensitive } }
      : {};

    const totalDocs = await this.prisma.word.count({ where });

    // Decodifica cursor se existir
    const decodedCursor = cursor
      ? JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'))
      : null;

    const queryOptions: any = {
      where,
      select: { text: true },
      orderBy: search ? { text: 'asc' } : undefined,
    };

    if (limit) {
      queryOptions.take = limit + 1; // +1 para saber se há próximo
    }

    if (decodedCursor) {
      queryOptions.cursor = { text: decodedCursor.text };
      queryOptions.skip = 1; // Pula o registro do cursor
    }

    const words = await this.prisma.word.findMany(queryOptions);

    let hasNext = false;
    let hasPrev = !!decodedCursor;

    if (limit && words.length > limit) {
      hasNext = true;
      words.pop(); // Remove o extra
    }

    const nextCursor = hasNext
      ? Buffer.from(JSON.stringify({ text: words[words.length - 1].text })).toString('base64')
      : null;

    const prevCursor = hasPrev
      ? Buffer.from(JSON.stringify({ text: words[0].text })).toString('base64')
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