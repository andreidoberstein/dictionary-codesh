import { DictionaryService } from "../services/dictionary.service";
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
}
