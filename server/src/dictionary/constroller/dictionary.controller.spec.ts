import { Test, TestingModule } from '@nestjs/testing';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from '../services/dictionary.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext, NotFoundException } from '@nestjs/common';

const mockDictionaryService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  favoriteWord: jest.fn(),
  unfavoriteWord: jest.fn(),
};

describe('DictionaryController', () => {
  let controller: DictionaryController;
  let service: DictionaryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DictionaryController],
      providers: [{ provide: DictionaryService, useValue: mockDictionaryService }],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({ canActivate: (context: ExecutionContext) => true })
    .compile();

    controller = module.get<DictionaryController>(DictionaryController);
    service = module.get<DictionaryService>(DictionaryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===================== findAll =====================
  describe('findAll', () => {
    it('should return a list of words with pagination', async () => {
      const mockResult = {
        results: ['apple', 'banana'],
        totalDocs: 2,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
        page: 1,
      };
      mockDictionaryService.findAll.mockResolvedValue(mockResult);

      const result = await controller.findAll('a', '1', '10');
      expect(result).toEqual(mockResult);
      expect(service.findAll).toHaveBeenCalledWith('a', 1, 10);
    });
  });

  // ===================== findOne =====================
  describe('findOne', () => {
    it('should return a single word', async () => {
      const mockWord = { id: '1', text: 'apple', createdAt: new Date() };
      mockDictionaryService.findOne.mockResolvedValue(mockWord);

      const result = await controller.findOne('apple');
      expect(result).toEqual(mockWord);
      expect(service.findOne).toHaveBeenCalledWith('apple');
    });

    it('should throw NotFoundException if word not found', async () => {
      mockDictionaryService.findOne.mockRejectedValue(new NotFoundException());

      await expect(controller.findOne('xyz')).rejects.toThrow(NotFoundException);
    });
  });

  // ===================== favoriteWord =====================
  describe('favoriteWord', () => {
    it('should favorite a word', async () => {
      mockDictionaryService.favoriteWord.mockResolvedValue(undefined);

      await expect(
        controller.favoriteWord('apple', { user: { id: '1' } } as any)
      ).resolves.toBeUndefined();

      expect(service.favoriteWord).toHaveBeenCalledWith('1', 'apple');
    });
  });

  // ===================== unfavoriteWord =====================
  describe('unfavoriteWord', () => {
    it('should unfavorite a word', async () => {
      mockDictionaryService.unfavoriteWord.mockResolvedValue(undefined);

      await expect(
        controller.unfavoriteWord('apple', { user: { id: '1' } } as any)
      ).resolves.toBeUndefined();

      expect(service.unfavoriteWord).toHaveBeenCalledWith('1', 'apple');
    });

    it('should throw NotFoundException if word not in favorites', async () => {
      mockDictionaryService.unfavoriteWord.mockRejectedValue(new NotFoundException());

      await expect(
        controller.unfavoriteWord('xyz', { user: { id: '1' } } as any)
      ).rejects.toThrow(NotFoundException);
    });
  });
});
