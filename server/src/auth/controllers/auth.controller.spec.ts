import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/signin.dto';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // ===================== register =====================
  describe('register', () => {
    const dto: RegisterDto = { name: 'Joe', email: 'joe@test.com', password: 'senha123' };

    it('should register a new user', async () => {
      const mockResponse = { id: '1', name: 'Joe', role: 'user' };
      mockAuthService.register.mockResolvedValue(mockResponse);

      const result = await controller.register(dto);
      expect(result).toEqual(mockResponse);
      expect(service.register).toHaveBeenCalledWith(dto);
    });

    it('should throw ConflictException if email exists', async () => {
      mockAuthService.register.mockRejectedValue(new ConflictException('Email already in use'));

      await expect(controller.register(dto)).rejects.toThrow(ConflictException);
    });
  });

  // ===================== login =====================
  describe('login', () => {
    const dto: LoginDto = { email: 'joe@test.com', password: 'senha123' };

    it('should login successfully', async () => {
      const mockResponse = { id: '1', name: 'Joe', token: 'jwt-token' };
      mockAuthService.login.mockResolvedValue(mockResponse);

      const result = await controller.login(dto);
      expect(result).toEqual(mockResponse);
      expect(service.login).toHaveBeenCalledWith(dto);
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      mockAuthService.login.mockRejectedValue(new UnauthorizedException('Invalid credentials'));

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
