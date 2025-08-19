// words.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import axios from 'axios';
import { WordsRepository } from '../repositories/words.repository';

@Injectable()
export class WordsService implements OnModuleInit {
  private readonly logger = new Logger(WordsService.name);
  constructor(private readonly wordsRepo: WordsRepository) {}

  async onModuleInit() {
    this.logger.log('Iniciando importação de palavras...');
    try {
      await this.importWords();
      this.logger.log('Importação concluída!');
    } catch (error) {
      this.logger.error('Erro durante a importação de palavras:', error);
    }
  }

  private async importWords() {
    this.logger.warn('⚠️ Limitando importação para 5000 palavras.');
    this.logger.log('Encontradas 5000 palavras. Salvando no banco...');
    this.importFromGitHub    
  }

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

// import { Injectable, Logger } from '@nestjs/common';
// import axios from 'axios';
// import { WordsRepository } from '../repositories/words.repository';

// @Injectable()
// export class WordsService {
//   private readonly logger = new Logger(WordsService.name);

//   constructor(private readonly wordsRepo: WordsRepository) {}

//   async importFromGitHub() {
//     const limitImportWors = 5000
//     const rawUrl = 'https://raw.githubusercontent.com/meetDeveloper/freeDictionaryAPI/master/meta/wordList/english.txt';

//     const { data } = await axios.get(rawUrl);

//     let words = data
//       .split('\n')
//       .map(w => w.trim())
//       .filter(Boolean)
//       .filter(word => !/[\s-]/.test(word))

//     if(limitImportWors && words.length > limitImportWors) {
//       words = words.slice(0, limitImportWors);
//       this.logger.warn(`⚠️ Limitando importação para ${limitImportWors} palavras.`);
//     }

//     this.logger.log(`Encontradas ${words.length} palavras. Salvando no banco...`);

//     await this.wordsRepo.upsertMany(words);

//     this.logger.log('Importação concluída!');
//   }
// }
