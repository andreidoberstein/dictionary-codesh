import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../services/user.service';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { UsersController } from './user.controller';

const mockUsersService = {
  findAll: jest.fn(),
  getProfile: jest.fn(),
  getUserHistory: jest.fn(),
  getUserFavorites: jest.fn(),
};

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    })
    .overrideGuard(JwtAuthGuard)
    .useValue({
      canActivate: (context: ExecutionContext) => true,
    })
    .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===================== findAll =====================
  describe('findAll', () => {
    it('should return a list of users', async () => {
      const mockUser = { id: '1', name: 'Andrei' };
      mockUsersService.findAll.mockResolvedValue([mockUser]);

      const result = await controller.findAll({ user: mockUser } as any);
      expect(result).toEqual([mockUser]);
      expect(service.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  // ===================== getProfile =====================
  describe('getProfile', () => {
    it('should return user profile', async () => {
      const mockProfile = { name: 'Andrei', email: 'andrei@test.com' };
      mockUsersService.getProfile.mockResolvedValue(mockProfile);

      const result = await controller.getProfile({ user: { id: '1' } } as any);
      expect(result).toEqual(mockProfile);
      expect(service.getProfile).toHaveBeenCalledWith('1');
    });
  });

  // ===================== getHistory =====================
  describe('getHistory', () => {
    it('should return user history with pagination', async () => {
      const mockHistory = {
        results: [{ word: 'apple', accessedAt: new Date() }],
        totalDocs: 1,
        totalPages: 1,
      };
      mockUsersService.getUserHistory.mockResolvedValue(mockHistory);

      const result = await controller.getHistory({ user: { id: '1' } } as any, '1', '10');
      expect(result).toEqual({
        ...mockHistory,
        page: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(service.getUserHistory).toHaveBeenCalledWith('1', 1, 10);
    });
  });

  // ===================== getFavorites =====================
  describe('getFavorites', () => {
    it('should return user favorites with pagination', async () => {
      const mockFavorites = {
        results: [{ word: 'banana', createdAt: new Date() }],
        totalDocs: 1,
        totalPages: 1,
      };
      mockUsersService.getUserFavorites.mockResolvedValue(mockFavorites);

      const result = await controller.getFavorites({ user: { id: '1' } } as any, '1', '10');
      expect(result).toEqual({
        ...mockFavorites,
        page: 1,
        hasNext: false,
        hasPrev: false,
      });
      expect(service.getUserFavorites).toHaveBeenCalledWith('1', 1, 10);
    });
  });
});
