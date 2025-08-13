import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryService } from '../services/dictionary.service';
import { NotFoundException } from '@nestjs/common';
import { DictionaryController } from './dictionary.controller';

describe('DictionaryController', () => {
  let controller: DictionaryController;
  let service: DictionaryService;

  const mockService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    favoriteWord: jest.fn(),
    unfavoriteWord: jest.fn(),
  };

  const mockUser = { id: 'user-id-1' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryController],
      providers: [
        { provide: DictionaryService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<DictionaryController>(DictionaryController);
    service = module.get<DictionaryService>(DictionaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('deve retornar palavras com cursor', async () => {
      const response = {
        results: ['apple', 'banana'],
        totalDocs: 5,
        previous: null,
        next: 'cursor-encoded',
        hasNext: true,
        hasPrev: false,
      };

      mockService.findAll.mockResolvedValue(response);

      const result = await controller.findAll(undefined, undefined, '2');
      expect(service.findAll).toHaveBeenCalledWith(undefined, undefined, 2);
      expect(result).toEqual(response);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma palavra existente', async () => {
      const wordEntry = { id: '1', text: 'apple', createdAt: new Date() };
      mockService.findOne.mockResolvedValue(wordEntry);

      const result = await controller.findOne('apple');
      expect(service.findOne).toHaveBeenCalledWith('apple');
      expect(result).toEqual(wordEntry);
    });

    it('deve lançar NotFoundException se a palavra não existir', async () => {
      mockService.findOne.mockRejectedValue(new NotFoundException('Palavra "orange" não encontrada'));

      await expect(controller.findOne('orange')).rejects.toThrow(NotFoundException);
    });
  });

  describe('favoriteWord', () => {
    it('deve favoritar uma palavra', async () => {
      mockService.favoriteWord.mockResolvedValue(undefined);

      await controller.favoriteWord('apple', { user: mockUser } as any);
      expect(service.favoriteWord).toHaveBeenCalledWith('user-id-1', 'apple');
    });
  });

  describe('unfavoriteWord', () => {
    it('deve desfavoritar uma palavra', async () => {
      mockService.unfavoriteWord.mockResolvedValue(undefined);

      await controller.unfavoriteWord('apple', { user: mockUser } as any);
      expect(service.unfavoriteWord).toHaveBeenCalledWith('user-id-1', 'apple');
    });

    it('deve lançar NotFoundException se a palavra não estiver nos favoritos', async () => {
      mockService.unfavoriteWord.mockRejectedValue(new NotFoundException('A palavra "apple" não está nos favoritos'));

      await expect(controller.unfavoriteWord('apple', { user: mockUser } as any))
        .rejects.toThrow(NotFoundException);
    });
  });
});
