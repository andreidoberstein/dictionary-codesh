import { HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { DictionaryRepository } from "../repositories/dictionary.repository";
import { HttpService } from "@nestjs/axios";
import { RedisService } from "src/redis/redis.service";

@Injectable()
export class DictionaryService {
  private readonly WORD_TTL_SECONDS = 60 * 60 * 24;

  constructor(
    private readonly dictionaryRepository: DictionaryRepository,
    private readonly httpService: HttpService,
    private readonly redis: RedisService,
  ) {}

  async findAll(search?: string, cursor?: string, limit?: number) {
    return this.dictionaryRepository.findAll(search, cursor, limit);
  }

  async findOne(word: string, userId: string) {
    const redisClient = this.redis.getClient();
    const cacheKey = `dict:word:${word.toLowerCase()}`;

    const cached = await redisClient.get(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      // marca HIT
      try {
        // nem todo contexto tem response (ex: unit test). Verifique.
        // quando tem, setamos o header:
        const res = (global as any).__nestHttpResponse__?.();
        // ignore se você não usa esse “hack”; abaixo vou mostrar um jeito via interceptor de cache
      } catch {}
      return parsed; // já é o corpo esperado
    }
    try {
      const response = await this.httpService
      .get(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`)
      .toPromise();

      const data = response?.data
      if (Array.isArray(data) === false && data?.title === 'No Definitions Found') {
        throw new NotFoundException(`Palavra "${word}" não encontrada`);
      }
      if (!data || !Array.isArray(data)) {
        throw new NotFoundException(`Palavra "${word}" não encontrada`);
      }

      await redisClient.set(cacheKey, JSON.stringify(data), 'EX', this.WORD_TTL_SECONDS);

      await this.dictionaryRepository.registerHistory(word, userId);
      return data;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error?.response?.status === 404) {
        throw new NotFoundException(`Palavra "${word}" não encontrada na API`);
      }
      console.error('Erro ao consultar API externa:', error?.message);
      throw new HttpException('Erro ao consultar API externa', HttpStatus.INTERNAL_SERVER_ERROR);
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