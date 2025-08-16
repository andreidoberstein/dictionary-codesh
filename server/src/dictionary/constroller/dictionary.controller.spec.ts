import { Test } from '@nestjs/testing';
import { DictionaryController } from './dictionary.controller';
import { DictionaryService } from '../services/dictionary.service';
import { CanActivate } from '@nestjs/common';

class JwtAuthGuardMock implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}

describe('DictionaryController', () => {
  let controller: DictionaryController;

  const service = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    favoriteWord: jest.fn(),
    unfavoriteWord: jest.fn(),
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [DictionaryController],
      providers: [
        { provide: DictionaryService, useValue: service },
        { provide: 'JwtAuthGuard', useClass: JwtAuthGuardMock }, // se seu guard for token class, veja overrideProvider abaixo
      ],
    })
      // override do guard pelo token real (se exportado como classe JwtAuthGuard)
      .overrideGuard((DictionaryController as any).guards?.JwtAuthGuard || (class {}) as any)
      .useValue(new JwtAuthGuardMock())
      .compile();

    controller = module.get(DictionaryController);
  });

  afterEach(() => jest.clearAllMocks());

  it('GET /entries/en chama service.findAll com params', async () => {
    service.findAll.mockResolvedValue({
      results: ['a', 'b'],
      totalDocs: 2,
      previous: null,
      next: null,
      hasNext: false,
      hasPrev: false,
    });

    const out = await controller.findAll('fire', 'c-b64', '4');

    expect(service.findAll).toHaveBeenCalledWith('fire', 'c-b64', 4);
    expect(out.results).toEqual(['a', 'b']);
  });

  it('GET /entries/en/:word chama service.findOne com userId do req', async () => {
    service.findOne.mockResolvedValue([{ word: 'hello' }]);

    const req = { user: { id: 'u1' } } as any;
    const out = await controller.findOne('hello', req);

    expect(service.findOne).toHaveBeenCalledWith('hello', 'u1');
    expect(out).toEqual([{ word: 'hello' }]);
  });

  it('POST /entries/en/:word/favorite retorna 204 (sem body) e chama service.favoriteWord', async () => {
    const req = { user: { id: 'u1' } } as any;
    await controller.favoriteWord('hello', req);
    expect(service.favoriteWord).toHaveBeenCalledWith('u1', 'hello');
  });

  it('DELETE /entries/en/:word/unfavorite retorna 204 (sem body) e chama service.unfavoriteWord', async () => {
    const req = { user: { id: 'u1' } } as any;
    await controller.unfavoriteWord('hello', req);
    expect(service.unfavoriteWord).toHaveBeenCalledWith('u1', 'hello');
  });
});
