import { DictionaryRepository } from "../repositories/dictionary.repository";
export declare class DictionaryService {
    private readonly dictionaryRepository;
    constructor(dictionaryRepository: DictionaryRepository);
    findAll(search?: string, cursor?: string, limit?: number): Promise<{
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
    favoriteWord(userId: string, word: string): Promise<void>;
    unfavoriteWord(userId: string, word: string): Promise<void>;
}
