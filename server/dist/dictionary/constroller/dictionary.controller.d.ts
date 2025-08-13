import { DictionaryService } from '../services/dictionary.service';
import type { RequestWithUser } from 'src/common/types/express';
export declare class DictionaryController {
    private readonly dictionaryService;
    constructor(dictionaryService: DictionaryService);
    findAll(search?: string | any, page?: string, limit?: string): Promise<{
        results: string[];
        totalDocs: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
    findOne(word: string): Promise<{
        id: string;
        text: string;
        createdAt: Date;
    }>;
    favoriteWord(word: string, req: RequestWithUser): Promise<void>;
    unfavoriteWord(word: string, req: RequestWithUser): Promise<void>;
}
