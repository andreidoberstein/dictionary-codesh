import { PrismaService } from "src/prisma/prisma.service";
export declare class DictionaryRepository {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(search: string, pageParam: number, limitParam: number): Promise<{
        results: string[];
        totalDocs: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findByWord(word: string): Promise<{
        id: string;
        createdAt: Date;
        text: string;
    } | null>;
    registerHistory(word: string): Promise<void>;
    addFavorite(userId: string, word: string): Promise<void>;
    unfavoriteWord(userId: string, word: string): Promise<void>;
}
