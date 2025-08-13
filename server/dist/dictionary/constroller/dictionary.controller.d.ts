import { DictionaryService } from '../services/dictionary.service';
import type { RequestWithUser } from '../../common/types/express';
export declare class DictionaryController {
    private readonly dictionaryService;
    constructor(dictionaryService: DictionaryService);
    findAll(search?: string | any, cursor?: string | any, limit?: string): Promise<{
        results: string[];
        totalDocs: number;
        previous: string | null;
        next: string | null;
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
