import { PrismaService } from '../../prisma/prisma.service';
export declare class WordsRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    upsertMany(words: string[]): Promise<void>;
    create(word: string): Promise<{
        id: string;
        createdAt: Date;
        text: string;
    }>;
}
