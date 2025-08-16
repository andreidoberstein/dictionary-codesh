import { DictionaryRepository } from './dictionary.repository';
import { NotFoundException } from '@nestjs/common';
import { prismaMock } from '../../../test/dictionary/__mocks__/prisma.service.mock';
import { usersServiceMock } from '../../../test/dictionary/__mocks__/users.service.mock';

function b64(obj: any) {
  return Buffer.from(JSON.stringify(obj)).toString('base64');
}

describe('DictionaryRepository', () => {
  const prisma = prismaMock() as any;
  const users = usersServiceMock() as any;
  let repo: DictionaryRepository;
  let consoleErrorSpy: jest.SpyInstance;
  

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });


  beforeEach(() => {
    jest.clearAllMocks();
    repo = new DictionaryRepository(prisma, users);
  });

  describe('findAll', () => {
    it('sem search: retorna tudo em ordem e sem paginação', async () => {
      prisma.word.count.mockResolvedValue(3);
      prisma.word.findMany.mockResolvedValue([
        { id: 1, text: 'a' },
        { id: 2, text: 'b' },
        { id: 3, text: 'c' },
      ]);

      const res = await repo.findAll(undefined, undefined, undefined);

      expect(prisma.word.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          select: { id: true, text: true },
          orderBy: [{ text: 'asc' }, { id: 'asc' }],
        })
      );
      expect(res.results).toEqual(['a', 'b', 'c']);
      expect(res.hasNext).toBe(false);
      expect(res.next).toBeNull();
    });

    it('com search: aplica limit+1 e cursor, calcula next/prev/hasNext', async () => {
      prisma.word.count.mockResolvedValue(5);

      // 1ª página: limit=2 → take=3
      prisma.word.findMany.mockResolvedValueOnce([
        { id: 10, text: 'fire' },
        { id: 11, text: 'firefly' },
        { id: 12, text: 'fireplace' }, // extra
      ]);

      const page1 = await repo.findAll('fire', undefined, 2);

      expect(prisma.word.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { text: { contains: 'fire', mode: 'insensitive' } },
          select: { id: true, text: true },
          orderBy: [{ text: 'asc' }, { id: 'asc' }],
          take: 3,
        })
      );
      expect(page1.results).toEqual(['fire', 'firefly']);
      expect(page1.hasNext).toBe(true);
      expect(page1.next).toBeTruthy();
      expect(page1.previous).toBeNull();
      expect(page1.hasPrev).toBe(false);

      // 2ª página com cursor (id do último da página anterior)
      const cursor = page1.next!;
      const decoded = JSON.parse(Buffer.from(cursor, 'base64').toString('ascii'));
      expect(decoded).toHaveProperty('id');

      prisma.word.findMany.mockResolvedValueOnce([
        { id: decoded.id, text: 'fireplace' }, // será skip=1
        { id: 13, text: 'fireman' },
        { id: 14, text: 'fireside' }, // extra
      ]);

      const page2 = await repo.findAll('fire', cursor, 2);
      expect(prisma.word.findMany).toHaveBeenLastCalledWith(
        expect.objectContaining({
          cursor: { id: decoded.id },
          skip: 1,
          take: 3,
        })
      );
      expect(page2.results).toEqual(['fireplace', 'fireman']);
      expect(page2.hasNext).toBe(true); // ainda sobrou extra
      expect(page2.previous).toBeTruthy();
      expect(page2.hasPrev).toBe(true);
    });
  });

  describe('registerHistory', () => {
    it('não cria se word não existe na tabela word', async () => {
      prisma.word.findUnique.mockResolvedValueOnce(null);

      await repo.registerHistory('ghost', 'u1');
      expect(prisma.wordHistories.create).not.toHaveBeenCalled();
    });

    it('não cria se já existe no histórico recente', async () => {
      prisma.word.findUnique.mockResolvedValueOnce({ id: 7 });
      users.getUserHistory.mockResolvedValueOnce({
        results: [{ word: { text: 'hello' } }],
      });

      await repo.registerHistory('hello', 'u1');
      expect(prisma.wordHistories.create).not.toHaveBeenCalled();
    });

    it('cria quando existe e não está no histórico', async () => {
      prisma.word.findUnique.mockResolvedValueOnce({ id: 7 });
      users.getUserHistory.mockResolvedValueOnce({ results: [] });

      await repo.registerHistory('world', 'u1');
      expect(prisma.wordHistories.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ userId: 'u1', wordId: 7 }),
        })
      );
    });
  });

  describe('favorites', () => {
    it('addFavorite faz upsert com userId_word', async () => {
      await repo.addFavorite('u1', 'alpha');
      expect(prisma.favorite.upsert).toHaveBeenCalledWith({
        where: { userId_word: { userId: 'u1', word: 'alpha' } },
        update: {},
        create: { userId: 'u1', word: 'alpha' },
      });
    });

    it('unfavoriteWord lança NotFound quando não achar registro', async () => {
      prisma.favorite.findFirst.mockResolvedValueOnce(null);

      await expect(repo.unfavoriteWord('u1', 'alpha')).rejects.toBeInstanceOf(NotFoundException);
      expect(prisma.favorite.delete).not.toHaveBeenCalled();
    });

    it('unfavoriteWord deleta quando encontrar', async () => {
      prisma.favorite.findFirst.mockResolvedValueOnce({ id: 99, userId: 'u1', word: 'alpha' });

      await repo.unfavoriteWord('u1', 'alpha');
      expect(prisma.favorite.delete).toHaveBeenCalledWith({ where: { id: 99 } });
    });
  });
});
