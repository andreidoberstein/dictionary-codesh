import { PrismaService } from '../../prisma/prisma.service';
import { Word } from '@prisma/client';
export declare class WordsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertMany(words: string[]): Promise<void>;
    create(word: string): Promise<Word>;
}
