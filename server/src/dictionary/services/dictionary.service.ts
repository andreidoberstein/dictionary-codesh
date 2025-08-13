import { Injectable } from "@nestjs/common";
import { DictionaryRepository } from "../repositories/dictionary.repository";

@Injectable()
export class DictionaryService {
  constructor(private readonly dictionaryRepository: DictionaryRepository) {}

  async findAll(search: string, page: number, limit: number,) {
    return this.dictionaryRepository.findAll(search, page, limit)
  }
}