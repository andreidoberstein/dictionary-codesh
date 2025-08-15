import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { DictionaryRepository } from "../repositories/dictionary.repository";
import { privateDecrypt } from "crypto";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class DictionaryService {
  constructor(
    private readonly dictionaryRepository: DictionaryRepository,
    private readonly httpService: HttpService
  ) {}

  async findAll(search?: string, cursor?: string, limit?: number) {
    return this.dictionaryRepository.findAll(search, cursor, limit);
  }

  async findOne(word: string, userId: string) {
    try {
      const response = await this.httpService
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
      .toPromise();

      const entry = response?.data
      if (!entry) {
        throw new NotFoundException(`Palavra "${word}" não encontrada`);
      }
      await this.dictionaryRepository.registerHistory(word, userId);
      return entry;
    } catch (error) {
      throw new HttpException(
        'Erro ao consultar API externa',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async favoriteWord(userId: string, word: string) {
    const entry = await this.dictionaryRepository.findByWord(word);
    if (!entry) {
      throw new NotFoundException(`Palavra "${word}" não encontrada`);
    }

    await this.dictionaryRepository.addFavorite(userId, word);
  }

  async unfavoriteWord(userId: string, word: string): Promise<void> {
    await this.dictionaryRepository.unfavoriteWord(userId, word)
  }
}