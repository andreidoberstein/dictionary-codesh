import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { IAuthService } from '../interfaces/auth-service.interface';
import { RegisterDto } from '../dto/signup.dto';
import { AuthEntity } from '../entities/auth.entity';
import { LoginDto } from '../dto/signin.dto';
export declare class AuthService implements IAuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    register(dto: RegisterDto): Promise<AuthEntity>;
    login(dto: LoginDto): Promise<AuthEntity>;
}
