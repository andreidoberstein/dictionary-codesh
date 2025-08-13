import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

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
}