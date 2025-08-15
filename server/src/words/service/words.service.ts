import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { WordsRepository } from '../repositories/words.repository';

@Injectable()
export class WordsService {
  private readonly logger = new Logger(WordsService.name);

  constructor(private readonly wordsRepo: WordsRepository) {}

  async importFromGitHub() {
    const limitImportWors = 5000
    const rawUrl = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';

    const { data } = await axios.get(rawUrl);

    let words = data
      .split('\n')
      .map(w => w.trim())
      .filter(Boolean)
      .filter(word => !/[\s-]/.test(word))

    if(limitImportWors && words.length > limitImportWors) {
      words = words.slice(0, limitImportWors);
      this.logger.warn(`⚠️ Limitando importação para ${limitImportWors} palavras.`);
    }

    this.logger.log(`Encontradas ${words.length} palavras. Salvando no banco...`);

    await this.wordsRepo.upsertMany(words);

    this.logger.log('Importação concluída!');
  }
}
