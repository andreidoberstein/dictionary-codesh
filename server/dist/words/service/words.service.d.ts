import { WordsRepository } from '../repositories/words.repository';
export declare class WordsService {
    private readonly wordsRepo;
    private readonly logger;
    constructor(wordsRepo: WordsRepository);
    importFromGitHub(): Promise<void>;
}
