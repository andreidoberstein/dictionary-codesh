import { DictionaryRepository } from "../repositories/dictionary.repository";
export declare class DictionaryService {
    private readonly dictionaryRepository;
    constructor(dictionaryRepository: DictionaryRepository);
    findAll(search: string, page: number, limit: number): Promise<{
        results: string[];
        totalDocs: number;
        page: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    }>;
}
