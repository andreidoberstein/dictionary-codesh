import { Injectable, NotFoundException } from "@nestjs/common";
import { DictionaryRepository } from "../repositories/dictionary.repository";

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepository: DictionaryRepository) {}

  async findAll(search: string, page: number, limit: number,) {
    return this.dictionaryRepository.findAll(search, page, limit)
  }

  async findOne(word: string) {
    const entry = await this.dictionaryRepository.findByWord(word);

    if (!entry) {
      throw new NotFoundException(`Palavra "${word}" não encontrada`);
    }

    await this.dictionaryRepository.registerHistory(word);

    return entry;
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