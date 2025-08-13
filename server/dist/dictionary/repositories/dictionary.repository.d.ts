import { PrismaService } from "../../prisma/prisma.service";
export declare class DictionaryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search?: string, cursor?: string, limitParam?: number): Promise<{
        results: string[];
        totalDocs: number;
        previous: string | null;
        next: string | null;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findByWord(word: string): Promise<{
        id: string;
        text: string;
        createdAt: Date;
    } | null>;
    registerHistory(word: string): Promise<void>;
    addFavorite(userId: string, word: string): Promise<void>;
    unfavoriteWord(userId: string, word: string): Promise<void>;
}
