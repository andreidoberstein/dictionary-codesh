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
    findOne(word: string): Promise<{
        id: string;
        createdAt: Date;
        text: string;
    }>;
    favoriteWord(userId: string, word: string): Promise<void>;
    unfavoriteWord(userId: string, word: string): Promise<void>;
}
