import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';
import { IUsersService } from '../interfaces/users-service.interface';
import { UpdateUserDto } from '../dto/update-user.dto';
export declare class UsersService implements IUsersService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(user: any): Promise<UserEntity[]>;
    update(id: string, dto: UpdateUserDto, user: any): Promise<UserEntity>;
    getProfile(userId: string): Promise<{
        name: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    getUserHistory(userId: string, page: number, limit: number): Promise<{
        results: {
            accessedAt: Date;
            word: {
                id: string;
                createdAt: Date;
                text: string;
            };
        }[];
        totalDocs: number;
        totalPages: number;
    }>;
    getUserFavorites(userId: string, page: number, limit: number): Promise<{
        results: {
            createdAt: Date;
            word: string;
        }[];
        totalDocs: number;
        totalPages: number;
    }>;
}
