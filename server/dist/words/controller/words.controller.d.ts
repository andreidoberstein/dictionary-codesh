import { WordsService } from '../service/words.service';
export declare class WordsController {
    private readonly wordsService;
    constructor(wordsService: WordsService);
    importFromGitHub(): Promise<{
        message: string;
    }>;
}
