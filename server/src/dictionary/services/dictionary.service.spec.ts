import { HttpException, NotFoundException } from '@nestjs/common';
import { DictionaryService } from './dictionary.service';
import { of } from 'rxjs';

// Mocks
const repo = {
  findAll: jest.fn(),
  findByWord: jest.fn(),
  registerHistory: jest.fn(),
  addFavorite: jest.fn(),
  unfavoriteWord: jest.fn(),
};
const http = {
  get: jest.fn(),
};

describe('DictionaryService', () => {
  let service: DictionaryService;

  beforeEach(() => {
    jest.clearAllMocks();
    service = new DictionaryService(repo as any, http as any);
  });

  describe('findAll', () => {
    it('delega pro repository com os parâmetros corretos', async () => {
      const result = { results: ['a', 'b'], totalDocs: 2, previous: null, next: null, hasNext: false, hasPrev: false };
      (repo.findAll as jest.Mock).mockResolvedValue(result);

      const out = await service.findAll('fire', 'cursor-b64', 4);

      expect(repo.findAll).toHaveBeenCalledWith('fire', 'cursor-b64', 4);
      expect(out).toBe(result);
    });
  });

  describe('findOne', () => {
    it('retorna dados da API externa e registra histórico', async () => {
      const word = 'hello';
      const userId = 'u1';
      const apiResp = [{ word: 'hello', meanings: [] }];

      (http.get as jest.Mock).mockReturnValueOnce(of({ data: apiResp }));

      const out = await service.findOne(word, userId);

      expect(out).toEqual(apiResp);
      expect(repo.registerHistory).toHaveBeenCalledWith(word, userId);
    });

    it('quando API retorna objeto com title=No Definitions Found → NotFound', async () => {
      const word = 'police';
      const userId = 'u';
      const apiResp = { title: 'No Definitions Found' };

      (http.get as jest.Mock).mockReturnValueOnce(of({ data: apiResp }));

      await expect(service.findOne(word, userId)).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.registerHistory).not.toHaveBeenCalled();
    });

    it('quando API 404 → NotFoundException', async () => {
      const word = 'missing';
      const userId = 'u';
      (http.get as jest.Mock).mockImplementationOnce(() =>
        // simula throw com status 404
        {
          return {
            toPromise: async () => {
              const err: any = new Error('not found');
              err.response = { status: 404 };
              throw err;
            },
          } as any;
        }
      );
      // o service usa .toPromise(); então mock acima já retorna algo com toPromise que lança.

      await expect(service.findOne(word, userId)).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.registerHistory).not.toHaveBeenCalled();
    });

    it('quando API quebra (500/erro genérico) → HttpException 500', async () => {
      const word = 'tre';
      const userId = 'u';
      (http.get as jest.Mock).mockImplementationOnce(() => {
        return {
          toPromise: async () => {
            const err: any = new Error('tre');
            err.response = { status: 500 };
            throw err;
          },
        } as any;
      });

      await expect(service.findOne(word, userId)).rejects.toBeInstanceOf(HttpException);
      expect(repo.registerHistory).not.toHaveBeenCalled();
    });
  });

  describe('favoriteWord', () => {
    it('lança NotFound se não existir a palavra', async () => {
      (repo.findByWord as jest.Mock).mockResolvedValue(null);
      await expect(service.favoriteWord('u1', 'x')).rejects.toBeInstanceOf(NotFoundException);
      expect(repo.addFavorite).not.toHaveBeenCalled();
    });

    it('se existir, chama addFavorite', async () => {
      (repo.findByWord as jest.Mock).mockResolvedValue({ id: 1, text: 'hello' });
      await service.favoriteWord('u1', 'hello');
      expect(repo.addFavorite).toHaveBeenCalledWith('u1', 'hello');
    });
  });

  describe('unfavoriteWord', () => {
    it('delega para o repository.unfavoriteWord', async () => {
      await service.unfavoriteWord('u1', 'hello');
      expect(repo.unfavoriteWord).toHaveBeenCalledWith('u1', 'hello');
    });
  });
});
