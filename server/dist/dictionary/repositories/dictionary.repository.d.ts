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
}
