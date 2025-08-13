import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { WordsRepository } from '../repositories/words.repository';

@Injectable()
export class WordsService {
  private readonly logger = new Logger(WordsService.name);

  constructor(private readonly wordsRepo: WordsRepository) {}

  async importFromGitHub() {
    const rawUrl = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';

    const { data } = await axios.get(rawUrl);

    const words = data
      .split('\n')
      .map(w => w.trim())
      .filter(Boolean);

    this.logger.log(`Encontradas ${words.length} palavras. Salvando no banco...`);

    await this.wordsRepo.upsertMany(words);

    this.logger.log('Importação concluída!');
  }
}
